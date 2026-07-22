import { RedisSortedSet } from "../redis/redis.sortedSet.js"
import { RedisRateLimitAndVotes } from "../redis/redis.rateLimitAndVotes.js"
import { emitToRoom } from "../redis/redis.pubsub.js"
import ApiError from "../../common/errors/ApiError.js"
import { NowPlayingState } from "./nowPlaying.types.js"
import { scheduleAdvance } from "./nowPlaying.scheduler.js"

export class NowPlayingService {

    static async advanceToNextSong(spaceId: string): Promise<NowPlayingState | null> {
        try {
            const queueItems = await RedisSortedSet.getFullQueue(spaceId)

            if (queueItems.length === 0) {
                await RedisSortedSet.clearNowPlaying(spaceId)
                emitToRoom("nowPlayingChanged", {}, spaceId)
                return null
            }

            const nextSongItem = queueItems[0]
            const songId = nextSongItem.value

            const songMetadata = await RedisSortedSet.getSongMetadata(spaceId, songId)
            if (!songMetadata) {
                throw ApiError.notFound("Song metadata not found")
            }

            await RedisSortedSet.removeSongFromQueue(spaceId, songId)
            await RedisSortedSet.deleteSongMetadata(spaceId, songId)
            await RedisRateLimitAndVotes.clearVotes(spaceId, songId)

            const nowPlayingInfo: NowPlayingState = {
                songId,
                title: songMetadata.title,
                url: songMetadata.url,
                thumbnail: songMetadata.thumbnail,
                startedAt: Date.now()
            }
            await RedisSortedSet.setNowPlaying(spaceId, nowPlayingInfo)

            emitToRoom("nowPlayingChanged", { song: nowPlayingInfo }, spaceId)

            const updatedQueue = await RedisSortedSet.getMergedQueue(spaceId)
            emitToRoom("queueUpdated", { queue: updatedQueue }, spaceId)

            return nowPlayingInfo
        } catch (error) {
            throw error
        }
    }

    // save duration, broadcast nowPlaying, trigger playback timer
    static async onDurationReported(spaceId: string, songId: string, duration: number): Promise<void> {
        const nowPlaying = await RedisSortedSet.getNowPlaying(spaceId)
        if (!nowPlaying) {
            throw ApiError.notFound("No song is currently playing in this space")
        }

        if (nowPlaying.songId !== songId) {
            return
        }

        const updatedNowPlaying = { ...nowPlaying, duration }
        await RedisSortedSet.setNowPlaying(spaceId, updatedNowPlaying)
        emitToRoom("nowPlayingChanged", { song: updatedNowPlaying }, spaceId)

        const elapsedMs = Date.now() - nowPlaying.startedAt
        const remainingMs = Math.max(duration * 1000 - elapsedMs, 0)
        const remainingSeconds = remainingMs / 1000

        scheduleAdvance(spaceId, songId, remainingSeconds, async (spaceId, songId) => {
            const current = await RedisSortedSet.getNowPlaying(spaceId)
            if (current?.songId === songId) {
                await this.advanceToNextSong(spaceId)
            }
        })
    }

    // schedule playback if nothing is currently playing
    static async tryStartPlayback(spaceId: string): Promise<void> {
        const nowPlaying = await RedisSortedSet.getNowPlaying(spaceId)
        if (!nowPlaying) {
            await this.advanceToNextSong(spaceId)
        }
    }
}

export default NowPlayingService

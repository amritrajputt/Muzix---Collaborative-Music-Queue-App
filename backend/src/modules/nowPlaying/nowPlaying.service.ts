import { RedisSortedSet } from "../redis/redis.sortedSet.js"
import { RedisRateLimitAndVotes } from "../redis/redis.rateLimitAndVotes.js"
import { emitToRoom } from "../redis/redis.pubsub.js"
import ApiError from "../../common/errors/ApiError.js"
import { NowPlayingState } from "./nowPlaying.types.js"

export class NowPlayingService {

    // pop queue, save history, update nowPlaying, broadcast update
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
            // Ignore stale duration reports for songs that are no longer playing
            return
        }

        const updatedNowPlaying = {
            ...nowPlaying,
            duration
        }
        await RedisSortedSet.setNowPlaying(spaceId, updatedNowPlaying)

        emitToRoom("nowPlayingChanged", { song: updatedNowPlaying }, spaceId)

        await this.tryStartPlayback(spaceId)
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

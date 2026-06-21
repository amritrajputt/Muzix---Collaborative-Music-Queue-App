import dotenv from "dotenv"
import { RedisBase } from "./redis.base.js"
dotenv.config()

export interface SongMetadata {
  title: string
  url: string
  thumbnail: string
  addedBy: string
  duration?: number
}

export class RedisSortedSet extends RedisBase {

  static async addToQueue(spaceId: string, songId: string) {
    await this.connect()
    const key = `queue:${spaceId}`
    const score = 0
    await this.client.zAdd(key, {
      score,
      value: songId
    })
  }
  static async incrementVote(spaceId: string, songId: string) {
    await this.connect()
    const key = `queue:${spaceId}`
    await this.client.zIncrBy(key, 1, songId)
    return this.client.zRangeWithScores(key, 0, -1, { REV: true })
  }

  static async getFullQueue(spaceId: string) {
    await this.connect()
    const key = `queue:${spaceId}`
    return this.client.zRangeWithScores(key, 0, -1, { REV: true })
  }
  static async removeSongFromQueue(spaceId: string, songId: string) {
    await this.connect()
    const key = `queue:${spaceId}`
    await this.client.zRem(key, songId)
  }
  static async queueSize(spaceId: string) {
    await this.connect()
    const key = `queue:${spaceId}`
    return this.client.zCard(key)
  }
  static async saveSongMetadata(spaceId: string, songId: string, songMetadata: SongMetadata) {
    await this.connect()
    const key = `song:${spaceId}:${songId}`
    const fields: Record<string, string | number> = {
      title: songMetadata.title,
      url: songMetadata.url,
      thumbnail: songMetadata.thumbnail,
      addedBy: songMetadata.addedBy
    }
    if (songMetadata.duration !== undefined) {
      fields.duration = songMetadata.duration
    }
    await this.client.hSet(key, fields)
  }

  static async getSongMetadata(spaceId: string, songId: string): Promise<SongMetadata | null> {
    await this.connect()
    const key = `song:${spaceId}:${songId}`
    const data = await this.client.hGetAll(key)
    if (!data || Object.keys(data).length === 0) return null
    const result: SongMetadata = {
      title: data.title || '',
      url: data.url || '',
      thumbnail: data.thumbnail || '',
      addedBy: data.addedBy || ''
    }
    if (data.duration !== undefined) {
      result.duration = Number(data.duration)
    }
    return result
  }

  static async setNowPlaying(
    spaceId: string, 
    songInfo: { songId: string, title: string, url: string, thumbnail: string, startedAt: number, duration?: number }
  ) {
    await this.connect()
    const key = `nowPlaying:${spaceId}`
    const fields: Record<string, string> = {
      songId: songInfo.songId,
      title: songInfo.title,
      url: songInfo.url,
      thumbnail: songInfo.thumbnail,
      startedAt: songInfo.startedAt.toString()
    }
    if (songInfo.duration !== undefined) {
      fields.duration = songInfo.duration.toString()
    }
    await this.client.hSet(key, fields)
  }

  static async getNowPlaying(spaceId: string) {
    await this.connect()
    const key = `nowPlaying:${spaceId}`
    const data = await this.client.hGetAll(key)
    if (!data || Object.keys(data).length === 0) return null
    const result: { songId: string, title: string, url: string, thumbnail: string, startedAt: number, duration?: number } = {
      songId: data.songId,
      title: data.title,
      url: data.url,
      thumbnail: data.thumbnail,
      startedAt: Number(data.startedAt)
    }
    if (data.duration !== undefined) {
      result.duration = Number(data.duration)
    }
    return result
  }

  static async clearNowPlaying(spaceId: string) {
    await this.connect()
    const key = `nowPlaying:${spaceId}`
    await this.client.del(key)
  }

  static async getMergedQueue(spaceId: string) {
    const queueItems = await this.getFullQueue(spaceId)
    const mergedQueue = []
    for (const item of queueItems) {
      const metadata = await this.getSongMetadata(spaceId, item.value)
      mergedQueue.push({
        songId: item.value,
        votes: item.score,
        title: metadata?.title || '',
        url: metadata?.url || '',
        thumbnail: metadata?.thumbnail || '',
        addedBy: metadata?.addedBy || '',
        duration: metadata?.duration
      })
    }
    return mergedQueue
  }
}

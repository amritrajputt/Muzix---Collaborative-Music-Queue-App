import dotenv from "dotenv"
import { RedisBase } from "./redis.base.js"
dotenv.config()

export interface SongMetadata {
  title: string
  url: string
  thumbnail: string
  addedBy: string
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
    await this.client.hSet(key, {
      title: songMetadata.title,
      url: songMetadata.url,
      thumbnail: songMetadata.thumbnail,
      addedBy: songMetadata.addedBy
    })
  }

  static async getSongMetadata(spaceId: string, songId: string): Promise<SongMetadata | null> {
    await this.connect()
    const key = `song:${spaceId}:${songId}`
    const data = await this.client.hGetAll(key)
    if (!data || Object.keys(data).length === 0) return null
    return {
      title: data.title || '',
      url: data.url || '',
      thumbnail: data.thumbnail || '',
      addedBy: data.addedBy || ''
    }
  }
}

import { createClient } from "redis"
import dotenv from "dotenv"
dotenv.config()

export class RedisBase {
  protected static client = createClient({
    url: process.env.REDIS_URL
  })

  private static connectPromise: Promise<any> | null = null

  protected static async connect() {
    if (!this.connectPromise) {
      this.connectPromise = this.client.connect().catch((err) => {
        this.connectPromise = null
        throw err
      })
    }
    await this.connectPromise
  }
}

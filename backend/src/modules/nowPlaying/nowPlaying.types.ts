export interface NowPlayingState {
  songId: string
  title: string
  url: string
  thumbnail: string
  startedAt: number
  duration?: number
}

export interface ReportDurationPayload {
  spaceId: string
  songId: string
  duration: number
}

export interface NowPlayingChangedPayload {
  song?: {
    songId: string
    title: string
    url: string
    thumbnail: string
  }
}

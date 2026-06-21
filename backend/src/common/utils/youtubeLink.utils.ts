const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export const isValidYoutubeLink = (url: string): boolean => {
  return YOUTUBE_REGEX.test(url)
}

export const extractVideoId = (url: string): string | null => {
  const match = url.match(YOUTUBE_REGEX)
  return match ? match[1] : null
}

export const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  return hours * 3600 + minutes * 60 + seconds
}
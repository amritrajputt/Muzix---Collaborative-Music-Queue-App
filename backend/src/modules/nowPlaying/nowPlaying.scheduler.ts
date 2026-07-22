
const activeTimers = new Map<string, NodeJS.Timeout>()

export function scheduleAdvance(spaceId: string, songId: string, durationSeconds: number, onAdvance: (spaceId: string, songId: string) => void) {
    
    const existing = activeTimers.get(spaceId)
    if (existing) clearTimeout(existing)

    const timer = setTimeout(() => {
        activeTimers.delete(spaceId)
        onAdvance(spaceId, songId)
    }, durationSeconds * 1000)

    activeTimers.set(spaceId, timer)
}

export function clearScheduledAdvance(spaceId: string) {
    const existing = activeTimers.get(spaceId)
    if (existing) {
        clearTimeout(existing)
        activeTimers.delete(spaceId)
    }
}
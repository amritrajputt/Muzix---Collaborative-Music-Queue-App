import { Server, Socket } from "socket.io"
import { JoinSpacePayload, LeaveSpacePayload, ReportDurationPayload } from "./socket.types.js"
import { emitToRoom } from "./socket.server.js"
import { NowPlayingService } from "../nowPlaying/nowPlaying.service.js"

export const registerSocketEvents = (socket: Socket, io: Server) => {
  console.log("a user connected via socket:", socket.id)

  socket.on("join-space", ({ spaceId, guestName }: JoinSpacePayload) => {
    socket.join(spaceId)
    socket.data.spaceId = spaceId
    socket.data.guestName = guestName
    emitToRoom("member-joined", { guestName }, spaceId)
  })

  socket.on("leave-space", ({ spaceId, guestName }: LeaveSpacePayload) => {
    socket.leave(spaceId)
    emitToRoom("member-left", { guestName }, spaceId)
  })

  socket.on("report-duration", async ({ spaceId, songId, duration }: ReportDurationPayload) => {
    try {
      await NowPlayingService.onDurationReported(spaceId, songId, duration)
    } catch (error) {
      console.error(`Error handling report-duration:`, error)
    }
  })

  socket.on("disconnect", () => {
    const { spaceId, guestName } = socket.data
    if (spaceId) {
      emitToRoom("member-left", { guestName }, spaceId)
    }
    console.log("user disconnected:", socket.id)
  })
}
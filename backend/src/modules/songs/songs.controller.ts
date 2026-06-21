import { Request, Response, NextFunction } from "express"
import ApiResponse from "../../common/responses/ApiResponse.js"
import ApiError from "../../common/errors/ApiError.js"
import songService from "./songs.service.js"

class songController {
    static async addSongController(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId, guestUuid, youtubeURL } = req.body
            if (!youtubeURL) {
                throw ApiError.badRequest("youtubeURL is required")
            }
            if (!guestUuid) {
                throw ApiError.badRequest("guestUuid is required")
            }
            if (!spaceId) {
                throw ApiError.badRequest("spaceId is required")
            }
            const song = await songService.addSong(spaceId, guestUuid, youtubeURL)
            const response = ApiResponse.created(201, song, "Song added successfully")
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    static async getSpaceSongsController(req: Request, res: Response, next: NextFunction) {
        try {
            const {spaceId} = req.params
            if (!spaceId) {
                throw ApiError.badRequest("spaceId is required")
            }
            const songs = await songService.getSpaceSongs(spaceId)
            const response = ApiResponse.success(200, {songs}, "Songs fetched successfully")
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

}
export { songController }
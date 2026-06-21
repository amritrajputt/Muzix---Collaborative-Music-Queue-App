import { NextFunction, Request, Response } from "express";
import ApiError from "../../common/errors/ApiError.js"
import ApiResponse from "../../common/responses/ApiResponse.js"
import { VoteService } from "./votes.service.js"

export class CreateVoteController {
    static async upvote(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId, songId } = req.body
            const guestUuid = req.guestUuid!

            if (!songId) {
                throw ApiError.badRequest("Song Id is required")
            }
            if (!spaceId) {
                throw ApiError.badRequest("Space Id is required")
            }
            const queue = await VoteService.createVote({ spaceId, songId, guestUuid })
            const response = ApiResponse.success(200, { queue }, "Vote created successfully")
            return res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
}
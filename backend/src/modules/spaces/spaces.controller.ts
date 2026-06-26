import { NextFunction, Request, Response } from "express"
import ApiError from "../../common/errors/ApiError.js"
import ApiResponse from "../../common/responses/ApiResponse.js"
import SpaceService from "./spaces.service.js"
import NowPlayingService from "../nowPlaying/nowPlaying.service.js"
import { emitToRoom } from "../redis/redis.pubsub.js"
import { RedisSortedSet } from "../redis/redis.sortedSet.js"

class SpaceController {
    static async createSpace(req: Request, res: Response, next: NextFunction) {
        try {
            const dbUserId = req.dbUser.id;
            const { spaceName, spacePassword } = req.body;
            if (!spaceName || !spacePassword) {
                throw ApiError.badRequest("spaceName and spacePassword are required");
            }

            const space = await SpaceService.createSpace({
                name: spaceName,
                password: spacePassword,
                userId: dbUserId
            })
            const response = ApiResponse.created(201, {
                space: {
                    ...space,
                    rawPassword: spacePassword
                }
            }, "Space created successfully")
            return res.status(response.statusCode).json(response)

        } catch (err) {
            next(err);
        }
    }
    static async joinSpace(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId, guestName, spacePassword } = req.body;

            if (!spaceId || !guestName || !spacePassword) {
                throw ApiError.badRequest("spaceId, guestName and spacePassword are required");
            }

            const space = await SpaceService.joinSpace({
                spaceId,
                guestName,
                spacePassword
            })
            const response = ApiResponse.created(201, { space }, "Space joined successfully")
            return res.status(response.statusCode).json(response)
        } catch (err) {
            next(err);
        }
    }

    static async getSpaceDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId } = req.params;
            if (!spaceId) {
                throw ApiError.badRequest("spaceId is required");
            }
            const space = await SpaceService.getSpaceById(spaceId)
            const response = ApiResponse.created(201, { space }, "Space details fetched successfully")
            return res.status(response.statusCode).json(response)
        } catch (err) {
            next(err);
        }
    }
    static async deleteSpace(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId } = req.params;
            if (!spaceId) {
                throw ApiError.badRequest("spaceId is required");
            }
            const space = await SpaceService.deleteSpace(spaceId)
            const response = ApiResponse.created(201, { space }, "Space deleted successfully")
            return res.status(response.statusCode).json(response)
        } catch (err) {
            next(err);
        }
    }
    static async getMySpaces(req: Request, res: Response, next: NextFunction) {
        try {
            const dbUserId = req.dbUser.id;
            const spaces = await SpaceService.getSpacesByUserId(dbUserId)
            const response = ApiResponse.created(201, { spaces }, "Spaces fetched successfully")
            return res.status(response.statusCode).json(response)
        } catch (err) {
            next(err);
        }
    }

    static async skipSong(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId } = req.params;
            const dbUserId = req.dbUser.id;

            const space = await SpaceService.getSpaceById(spaceId);
            if (space.userId !== dbUserId) {
                throw ApiError.forbidden("Only the space creator can skip songs");
            }

            await NowPlayingService.advanceToNextSong(spaceId);
            const response = ApiResponse.success(200, {}, "Song skipped successfully");
            return res.status(response.statusCode).json(response);
        } catch (err) {
            next(err);
        }
    }

    static async controlPlayback(req: Request, res: Response, next: NextFunction) {
        try {
            const { spaceId } = req.params;
            const { isPlaying, currentTime } = req.body;
            const dbUserId = req.dbUser.id;

            const space = await SpaceService.getSpaceById(spaceId);
            if (space.userId !== dbUserId) {
                throw ApiError.forbidden("Only the space creator can control playback");
            }

            // Update playback state in Redis nowPlaying hash
            const nowPlaying = await RedisSortedSet.getNowPlaying(spaceId);
            if (nowPlaying) {
                nowPlaying.isPlaying = isPlaying;
                if (!isPlaying) {
                    nowPlaying.pausedAt = currentTime;
                } else {
                    nowPlaying.startedAt = Date.now() - (currentTime * 1000);
                    nowPlaying.pausedAt = undefined;
                }
                await RedisSortedSet.setNowPlaying(spaceId, nowPlaying);
                
                // Broadcast updated nowPlaying metadata to all clients
                emitToRoom("nowPlayingChanged", { song: nowPlaying }, spaceId);
            }

            emitToRoom("playback-state-changed", { isPlaying, currentTime }, spaceId);
            const response = ApiResponse.success(200, { isPlaying, currentTime }, "Playback state changed successfully");
            return res.status(response.statusCode).json(response);
        } catch (err) {
            next(err);
        }
    }
}
export default SpaceController
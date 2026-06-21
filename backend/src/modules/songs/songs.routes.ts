import Router from "express";
import { songController } from "./songs.controller.js";
import {auth}  from "../../common/middleware/auth.middleware.js";
const songRouter = Router();

songRouter.post("/add", auth, songController.addSongController)
songRouter.get('/:spaceId/songs', songController.getSpaceSongsController)

export default songRouter
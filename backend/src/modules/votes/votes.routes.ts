import { Router } from "express"
import { CreateVoteController } from "./votes.controller.js"
import { getGuestIdentifier } from "../../common/middleware/guest.middleware.js"

const voteRouter = Router()

voteRouter.post("/upvote", getGuestIdentifier, CreateVoteController.upvote)

export default voteRouter

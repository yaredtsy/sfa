import { Router } from "express";
import {
  CreateChannel,
  GetAllChannel,
  GetOneChannel,
  UpdateChannel,
  DeleteChannel
} from 'controller/channelController';

import isAuthenticated from "Middleware/isAuthenticated";


const router = Router();


/*
 * @method POST
 * @url /api/v1.0/channels/
 * @desc create channels
 * @params
 *
 */
router.post("/", isAuthenticated, CreateChannel);


/*
 * @method GET
 * @url /api/v1.0/channels/
 * @desc get all channels
 * @params
 *
 */
router.get("/", isAuthenticated, GetAllChannel);


/*
 * @method GET
 * @url /api/v1.0/channels/:id
 * @desc get one channels
 * @params channel id
 *
 */
router.get("/:id", isAuthenticated, GetOneChannel);


/*
 * @method PATCH
 * @url /api/v1.0/channels/:id
 * @desc update channels
 * @params channel id
 *
 */
router.patch("/:id", isAuthenticated, UpdateChannel);


/*
 * @method DELETE
 * @url /api/v1.0/channels/:id
 * @desc delete channels
 * @params channel id
 *
 */
router.delete("/:id", isAuthenticated, DeleteChannel);

export default router;

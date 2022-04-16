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


// CREATE/POST
router.post("/", isAuthenticated, CreateChannel);

// GET ALL
router.get("/", isAuthenticated, GetAllChannel);

// GET ONE
router.get("/:id", isAuthenticated, GetOneChannel);

// PATCH
router.patch("/:id", isAuthenticated, UpdateChannel);

// DELETE
router.delete("/:id", isAuthenticated, DeleteChannel);

export default router;

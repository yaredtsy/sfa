import { Router } from "express";
import {
  createNation,
  GetAllNation,
  GetOneNation,
  UpdateNational,
  DeleteNation,
} from 'controller/nationalController';

import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();
// for test purpose


// CREATE/POST
router.post("/", isAuthenticated, createNation);

// GET ALL
router.get("/", isAuthenticated, GetAllNation);

// GET ONE
router.get("/:id", isAuthenticated, GetOneNation);

// PATCH
router.patch("/:id", isAuthenticated, UpdateNational);

// DELETE
router.delete("/:id", isAuthenticated, DeleteNation);

export default router;

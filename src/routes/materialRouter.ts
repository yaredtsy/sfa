import { Router } from "express";

import {
  CreateMaterial,
  GetAllMaterial,
  GetOneMaterial,
  UpdateMaterial,
  DeleteMaterial
} from "controller/materialController";

import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

// CREATE/POST
router.post("/", isAuthenticated, CreateMaterial);

// GET ALL
router.get("/", isAuthenticated,GetAllMaterial);

// GET ONE
router.get("/:id", isAuthenticated, GetOneMaterial);

// PATCH
router.patch("/:id", isAuthenticated, UpdateMaterial);

// DELETE
router.delete("/:id", isAuthenticated,DeleteMaterial);

export default router;

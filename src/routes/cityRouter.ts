import { Router } from "express";
import {
  CreateCity,
  GetAllCity,
  GetOneCity,
  UpdateCity,
  DeleteCity
} from 'controller/CityController';

import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

// CREATE/POST
router.post("/", isAuthenticated, CreateCity);

// GET ALL
router.get("/", isAuthenticated, GetAllCity);

// GET ONE
router.get("/:id", isAuthenticated, GetOneCity);

// PATCH
router.patch("/:id", isAuthenticated, UpdateCity);

// DELETE
router.delete("/:id", isAuthenticated, DeleteCity);

export default router;

import { Router } from "express";

import {
  CreateCompany,
  GetAllCompany,
  GetOneCompany,
  UpdateCompany,
  DeleteCompany,
} from "controller/companyController";
import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

// CREATE/POST
router.post("/", isAuthenticated, CreateCompany);

// GET ALL
router.get("/", isAuthenticated, GetAllCompany);

// GET ONE
router.get("/:id", isAuthenticated, GetOneCompany);

// PATCH
router.patch("/:id", isAuthenticated, UpdateCompany);

// DELETE
router.delete("/:id", isAuthenticated, DeleteCompany);

export default router;

import { Router } from "express";
import {
  CreateInvoice,
  GetAllInvoice,
  GetOneInvoice,
  UpdateInvoice,
  DeleteInvoice,
} from "controller/invoiceController";
import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

// CREATE/POST
router.post("/", isAuthenticated, CreateInvoice);

// GET ALL
router.get("/", isAuthenticated, GetAllInvoice);

// GET ONE
router.get("/:id", isAuthenticated, GetOneInvoice);

// PATCH
router.patch("/:id", isAuthenticated, UpdateInvoice);

// DELETE
router.delete("/:id", isAuthenticated, DeleteInvoice);

export default router;

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

/*
 * @method POST
 * @url /api/v1.0/invoices/
 * @desc create invoices
 * @params
 *
 */
router.post("/", isAuthenticated, CreateInvoice);

/*
 * @method GET
 * @url /api/v1.0/invoices/
 * @desc Get all invoices
 * @params
 *
 */
router.get("/", isAuthenticated, GetAllInvoice);

/*
 * @method GET
 * @url /api/v1.0/invoices/:id
 * @desc get one invoices
 * @params invoices id
 *
 */
router.get("/:id", isAuthenticated, GetOneInvoice);

/*
 * @method PATCH
 * @url /api/v1.0/invoices/:id
 * @desc update invoices
 * @params invoices id
 *
 */
router.patch("/:id", isAuthenticated, UpdateInvoice);

/*
 * @method DELETE
 * @url /api/v1.0/invoices/:id
 * @desc delete invoices
 * @params invoices id
 *
 */
router.delete("/:id", isAuthenticated, DeleteInvoice);

export default router;

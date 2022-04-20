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

/*
 * @method POST
 * @url /api/v1.0/companies/
 * @desc create companies
 * @params
 *
 */
router.post("/", isAuthenticated, CreateCompany);

/*
 * @method GET
 * @url /api/v1.0/companies/
 * @desc get all company
 * @params
 *
 */
router.get("/", isAuthenticated, GetAllCompany);

/*
 * @method GET
 * @url /api/v1.0/companies/:id
 * @desc get one company
 * @params company id
 *
 */
router.get("/:id", isAuthenticated, GetOneCompany);

/*
 * @method POST
 * @url /api/v1.0/companies/:id
 * @desc update companies
 * @params company id
 *
 */
router.patch("/:id", isAuthenticated, UpdateCompany);

/*
 * @method POST
 * @url /api/v1.0/companies/Lid
 * @desc delete companies
 * @params company id
 *
 */
router.delete("/:id", isAuthenticated, DeleteCompany);

export default router;

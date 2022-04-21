import { Router } from "express";
import {
  createNation,
  GetAllNation,
  GetOneNation,
  UpdateNational,
  DeleteNation,
} from "controller/nationalController";

import isAuthenticated from "Middleware/isAuthenticated";
import { NationalSchema } from "Middleware/validation/schema";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();
// for test purpose

/*
 * @method POST
 * @url /api/v1.0/nations/
 * @desc create nations
 * @params
 *
 */
router.post(
  "/",
  NationalSchema,
  validateRequestSchema,
  isAuthenticated,
  createNation
);

/*
 * @method GET
 * @url /api/v1.0/nations/
 * @desc get all nations
 * @params
 *
 */
router.get("/", isAuthenticated, GetAllNation);

/*
 * @method GET
 * @url /api/v1.0/nations/:id
 * @desc get one nations by id
 * @params nation id
 *
 */
router.get("/:id", isAuthenticated, GetOneNation);

/*
 * @method PATCH
 * @url /api/v1.0/nations/:id
 * @desc update  nation
 * @params nation id
 *
 */
router.patch("/:id", isAuthenticated, UpdateNational);

/*
 * @method DELETE
 * @url /api/v1.0/nations/:id
 * @desc get all nations
 * @params nation id
 *
 */
router.delete("/:id", isAuthenticated, DeleteNation);

export default router;

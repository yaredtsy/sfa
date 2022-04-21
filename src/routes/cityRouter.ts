import { Router } from "express";
import {
  CreateCity,
  GetAllCity,
  GetOneCity,
  UpdateCity,
  DeleteCity,
} from "controller/CityController";
import { CitySchema } from "Middleware/validation/schema";
import isAuthenticated from "Middleware/isAuthenticated";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/cities/
 * @desc create cities
 * @params
 *
 */
router.post(
  "/",
  CitySchema,
  validateRequestSchema,
  isAuthenticated,
  CreateCity
);

/*
 * @method GET
 * @url /api/v1.0/cities/
 * @desc get cities
 * @params
 *
 */
router.get("/", isAuthenticated, GetAllCity);

/*
 * @method GET
 * @url /api/v1.0/cities/:id
 * @desc Get one cities
 * @params cities id
 *
 */
router.get("/:id", isAuthenticated, GetOneCity);

/*
 * @method PATCH
 * @url /api/v1.0/cities/:id
 * @desc get one cities
 * @params cities id
 *
 */
router.patch("/:id", isAuthenticated, UpdateCity);

/*
 * @method DELETE
 * @url /api/v1.0/cities/
 * @desc delete cities
 * @params cities id
 *
 */
router.delete("/:id", isAuthenticated, DeleteCity);

export default router;

import { Router } from "express";
import {RegionSchema} from 'Middleware/validation/schema'
import {
  CreateRegion,
  GetAll,
  GetOneRegion,
  UpdateRegion,
  DeleteRegion,
} from "controller/regionController";
import isAuthenticated from "../Middleware/isAuthenticated";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/regions/
 * @desc create region
 * @params
 *
 */
router.post("/",RegionSchema, validateRequestSchema,isAuthenticated, CreateRegion);

/*
 * @method GET
 * @url /api/v1.0/regions/
 * @desc get all region
 * @params
 *
 */
router.get("/", isAuthenticated, GetAll);

/*
 * @method GET
 * @url /api/v1.0/regions/:id
 * @desc get one region
 * @params route id
 *
 */
router.get("/:id", isAuthenticated, GetOneRegion);

/*
 * @method PATCH
 * @url /api/v1.0/regions/:id
 * @desc update region
 * @params route id
 *
 */
router.patch("/:id", isAuthenticated, UpdateRegion);

/*
 * @method DELET
 * @url /api/v1.0/regions/:id
 * @desc delete region
 * @params route id
 *
 */
router.delete("/:id", isAuthenticated, DeleteRegion);

export default router;

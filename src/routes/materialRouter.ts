import { Router } from "express";

import {
  CreateMaterial,
  GetAllMaterial,
  GetOneMaterial,
  UpdateMaterial,
  DeleteMaterial
} from "controller/materialController";
import { MaterialSchema } from 'Middleware/validation/schema';
import isAuthenticated from "Middleware/isAuthenticated";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/materials/
 * @desc create material
 * @params
 *
 */
router.post("/",MaterialSchema,validateRequestSchema, isAuthenticated, CreateMaterial);

/*
 * @method GET
 * @url /api/v1.0/materials/
 * @desc get all material
 * @params
 *
 */
router.get("/", isAuthenticated,GetAllMaterial);

/*
 * @method GET
 * @url /api/v1.0/materials/:id
 * @desc get one material
 * @params
 *
 */
router.get("/:id", isAuthenticated, GetOneMaterial);

/*
 * @method PATCH
 * @url /api/v1.0/materials/:id
 * @desc update material
 * @params
 *
 */
router.patch("/:id", isAuthenticated, UpdateMaterial);

/*
 * @method DELETE
 * @url /api/v1.0/materials/:id
 * @desc delete material
 * @params
 *
 */
router.delete("/:id", isAuthenticated,DeleteMaterial);

export default router;

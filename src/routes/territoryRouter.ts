import { Router } from "express";

import {TerritorySchema} from 'Middleware/validation/schema'
import {
  CreateTerritory,
  GetAllTerritories,
  GetOneTerritory,
  UpdateTerritory,
  DeleteTerritory,
} from "controller/territoryController";
import isAuthenticated from "Middleware/isAuthenticated";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/territories/
 * @desc create territory
 * @params territory id
 *
 */
router.post("/", TerritorySchema,validateRequestSchema,isAuthenticated, CreateTerritory);

/*
 * @method GET
 * @url /api/v1.0/territories/
 * @desc get territories
 * @params territory id
 *
 */
router.get("/", isAuthenticated, GetAllTerritories);

/*
 * @method GET
 * @url /api/v1.0/territories/:id
 * @desc get territory
 * @params territory id
 *
 */
router.get("/:id", isAuthenticated, GetOneTerritory);

/*
 * @method PATCH
 * @url /api/v1.0/territories/:id
 * @desc update territory
 * @params territory id
 *
 */
router.patch("/:id", isAuthenticated, UpdateTerritory);
/*
 * @method DELETE
 * @url /api/v1.0/territories/:id
 * @desc delete territory
 * @params territory id
 *
 */
router.delete("/:id", isAuthenticated, DeleteTerritory);

export default router;

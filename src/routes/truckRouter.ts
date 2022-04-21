import { Router } from "express";

import {TruckSchema} from 'Middleware/validation/schema'
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

import {
  CreateTruck,
  GetUser,
  GetAllTruck,
  DeleteTruck,
  UpdateTruck,
} from "controller/trackController";
import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/trucks
 * @desc create truck
 * @params null
 * @response [User]
 */
router.post("/", TruckSchema,validateRequestSchema,isAuthenticated, CreateTruck);

/*
 * @method GET
 * @url /api/v1.0/trucks
 * @desc get all users
 * @params null
 *
 */

router.get("/", isAuthenticated, GetAllTruck);

/*
 * @method GET
 * @url /api/v1.0/trucks/:id
 * @desc get user
 * @params id
 *
 */

router.get("/:id", isAuthenticated, GetUser);

/*
 * @method PATCH
 * @url /api/v1.0/trucks/:id
 * @desc update truck
 * @params id
 *
 */
router.patch("/:id", isAuthenticated, UpdateTruck);

/*
 * @method DELETE
 * @url /api/v1.0/trucks/:id
 * @desc delete truck
 * @params user id
 *
 */
router.delete("/:id", isAuthenticated, DeleteTruck);

export default router;

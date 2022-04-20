import { Router } from "express";
import {
  CreateCity,
  GetAllCity,
  GetOneCity,
  UpdateCity,
  DeleteCity
} from 'controller/CityController';

import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/cities/
 * @desc create cities
 * @params
 *
 */
router.post("/", isAuthenticated, CreateCity);

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

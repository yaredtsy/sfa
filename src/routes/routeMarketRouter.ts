import { Router } from "express";
import { RouteSchema } from "Middleware/validation/schema";
import {
  CreateRouteMarket,
  GetAll,
  GetOne,
  UpdateRouteMarket,
  Delete,
} from "controller/routeMarketController";
import isAuthenticated from "Middleware/isAuthenticated";
import { validateRequestSchema } from "Middleware/validation/validate-request-schema";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/route-markets/
 * @desc returns all users
 * @params null
 * @response [User]
 */
router.post(
  "/",
  RouteSchema,
  validateRequestSchema,
  isAuthenticated,
  CreateRouteMarket
);

/*
 * @method GET
 * @url /api/v1.0/route-markets/
 * @desc returns all users
 * @params null
 * @response [User]
 */
router.get("/", isAuthenticated, GetAll);

/*
 * @method GET
 * @url /api/v1.0/route-markets/
 * @desc returns all users
 * @params null
 * @response [User]
 */
router.get("/:id", isAuthenticated, GetOne);

/*
 * @method PATCH
 * @url /api/v1.0/route-markets/
 * @desc returns all users
 * @params null
 * @response [User]
 */
router.patch("/:id", isAuthenticated, UpdateRouteMarket);

/*
 * @method DELETE
 * @url /api/v1.0/route-markets/
 * @desc returns all users
 * @params null
 * @response [User]
 */
router.delete("/:id", isAuthenticated, Delete);

export default router;

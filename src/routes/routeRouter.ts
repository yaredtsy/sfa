import { Router } from "express";
import {
  Create,
  AddPolygon,
  GetAll,
  GetOne,
  Update,
  Delete,
} from "controller/routerController";
import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();

/*
 * @method POST
 * @url /api/v1.0/routes/
 * @desc create route
 * @params 
 *
 */
router.post("/",isAuthenticated,Create);


/*
 * @method POST
 * @url /api/v1.0/routes/add
 * @desc add polygon
 * @params 
 *
 */
router.post("/add",isAuthenticated,AddPolygon);


/*
 * @method GET
 * @url /api/v1.0/routes/
 * @desc GET All route
 * @params 
 *
 */
router.get("/", isAuthenticated,GetAll);

/*
 * @method PATCH
 * @url /api/v1.0/routes/
 * @desc GET one route
 * @params route id
 *
 */
router.get("/:id", isAuthenticated,GetOne);


/*
 * @method PATCH
 * @url /api/v1.0/routes/
 * @desc update route
 * @params route id
 *
 */
router.patch("/:id",isAuthenticated,Update);


/*
 * @method DELETE
 * @url /api/v1.0/routes/
 * @desc delete route
 * @params route id
 *
 */
router.delete("/:id", isAuthenticated,Delete);

export default router;

import { Router } from "express";
import {
  CreateOutlet,
  DeleteOutlet,
  GetAllController,
  GetByPageNumber,
  GetOneOutlet,
  UpdateOutlet
} from 'controller/outletController';

import isAuthenticated from "Middleware/isAuthenticated";

const router = Router();



/*
 * @method POST
 * @url /api/v1.0/outlets/
 * @desc create region
 * @params 
 *
 */
router.post("/", isAuthenticated, CreateOutlet);

/*
 * @method GET
 * @url /api/v1.0/outlets/
 * @desc get all outlets
 * @params 
 *
 */
router.get("/", isAuthenticated,GetAllController);

/*
 * @method GET
 * @url /api/v1.0/outlets/
 * @desc get page by pageNumber
 * @params pagenumber
 *
 */
router.get("/pages/:pageNumber", isAuthenticated, GetByPageNumber);

/*
 * @method GET
 * @url /api/v1.0/outlets/
 * @desc get one region
 * @params outlet id
 *
 */
router.get("/:id", isAuthenticated, GetOneOutlet);

/*
 * @method PATCH
 * @url /api/v1.0/outlets/
 * @desc update outlet
 * @params outlet id
 *
 */
router.patch("/:id", isAuthenticated, UpdateOutlet);

/*
* @method DELETE
* @url /api/v1.0/outlets/
* @desc delete outlet
* @params outlet id
*
*/
router.delete("/:id", isAuthenticated,DeleteOutlet);

export default router;

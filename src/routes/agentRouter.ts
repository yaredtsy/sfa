import { Router } from "express";

import isAuthenticated from "Middleware/isAuthenticated";
import {createAgent,getAllAgent,getAgent,updateAgent,deleteAgent} from "controller/agentController";

const router = Router();


/*
 * @method POST
 * @url /api/v1.0/agents/
 * @desc create agents
 * @params
 *
 */
router.post("/", isAuthenticated,createAgent);


/*
 * @method GET
 * @url /api/v1.0/agents/
 * @desc get all agents
 * @params
 *
 */
router.get("/", isAuthenticated, getAllAgent);


/*
 * @method GET
 * @url /api/v1.0/agents/:id
 * @desc get one agents
 * @params agent id
 *
 */
router.get("/:id", isAuthenticated, getAgent);


/*
 * @method PATCH
 * @url /api/v1.0/agents/:id
 * @desc update agents
 * @params agent id
 *
 */
router.patch("/:id", isAuthenticated, updateAgent);


/*
 * @method DELETE
 * @url /api/v1.0/agents/:id
 * @desc delete agents
 * @params agent id
 *
 */
router.delete("/:id", isAuthenticated, deleteAgent);

export default router;

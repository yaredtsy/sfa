import { Router } from "express";
import {GetUser,GetAllUser,DeleteUser,CreateUser,Login,UpdateUser,forgetPassword} from 'controller/UserController';

const router = Router();

/*
 * @method GET
 * @url /api/v1.0/users
 * @desc returns all users
 * @params null
 * @response [User]
*/
router.get("/", GetAllUser);

/*
 * @method GET
 * @url /api/v1.0/users/:id
 * @desc returns selected user
 * @Parmas user id
 * @response User
 */
router.get("/:id", GetUser);

/*
 * @method POST
 * @url /api/v1.0/users
 * @desc Create user
 * @params null
 * @req User
 * @res User
 * 
 */
router.post("/", CreateUser);

/*
 * @method PATCH
 * @url /api/v1.0/users/:id
 * @desc update user
 * @params user id
 * 
 * 
 */
router.patch("/:id", UpdateUser);

/*
 * @method DELETE
 * @url /api/v1.0/users/:id
 * @desc delete user
 * @params user id
 * 
 * 
 */

router.delete("/:id",DeleteUser);

/*
 * @method POST
 * @url /api/v1.0/users/login
 * @desc update user
 * @params null
 * 
 * 
 */

router.post("/login", Login);

/*
 * @method POST
 * @url /api/v1.0/users/forget-password
 * @desc reset password
 * @params null
 * 
 * 
 */

router.post("/forget-password", forgetPassword);

export default router;

import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
const isAuthenticated = async (req: any, res: any, next: any) => {
  let authheader = null;
  if (req.headers.authorization) {
    authheader = req.headers.authorization.split(" ")[1];
  }
  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    authheader;
  try {
    if (!token || token == 'j:null') {
      return res.status(401).json({ msg: "not logged in" });
    } else {
      // const decoded = jwt.verify(token, process.env.JWT_SECRET || "SFAJWT", (err, data) => {
      //     if(err){
      //         return res.status(401).json({msg: "Invalid Token"});
      //     }else {
      //         return data;
      //     }
      // })
      const decoded = await jwt.verify(
        token,
        process.env.JWT_SECRET || "SFAJWT"
      );
      req.user = decoded;
      next();
    }
  } catch (err) {
      return res.status(401).json({msg: "Invalid Token", err: err})
  }
};

export default isAuthenticated;

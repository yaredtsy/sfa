import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import status from "http-status-codes";

export const validateRequestSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(status.BAD_REQUEST).json(errors.array())
    }
};

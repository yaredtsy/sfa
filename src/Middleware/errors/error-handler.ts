import { StatusCodes } from 'http-status-codes';
import express from "express";

interface defaultErrorProps{
    statusCode: number;
    msg: any;
}
const errorHandlerMiddleware = (err: { name: string | null, code: number | null, errors: any, keyValue: any, statusCode: number, message: string | null }, req:express.Request, res:express.Response) => {
    
    const defaultError:defaultErrorProps = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later',
    }
    
    if (err.name === 'ValidationError') {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        // defaultError.msg = err.message;
        defaultError.msg = Object.values(err.errors).map((item:any,index:number) => item.message).join(',')
    }
    
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }
    
    res.status(defaultError.statusCode).json({ err: defaultError.msg });
}

export default errorHandlerMiddleware

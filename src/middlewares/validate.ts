import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
        const format = errors.array().map((err: any) =>{
            return {
                field: err.path,
                msg: err.msg
            };
        })
        return errorResponse(res, `Validation error`, 500, format)
    }
    next();
}
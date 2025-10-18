import { Request, Response } from "express"
import { body } from "express-validator";
//import { getAdminByEmail} from "../services/admin.service";

export const authAdminLoginValidation = [
    body('email').notEmpty(),
    body('password').isLength({min:6}).bail()
];


export const invoiceValidation = [
        body('data').notEmpty(),       
];
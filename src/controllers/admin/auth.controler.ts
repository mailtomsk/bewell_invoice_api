import { Request, Response } from "express";
import { successResponseAdmin, errorResponseAdmin } from "../../utils/response";
import bcrypt from "bcrypt";
import { getAdminByEmail,lastLoginUpdate,getAdminById} from '../../services/admin.service';
import { verifyToken, generateToken } from "../../utils/jwt";
import crypto from 'crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MIN=30

const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function generateRandomNumber(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export const adminLogin = async(req : Request, res: Response) => {
    try {
        const { email, password} = req.body;
        const isEmail :  boolean = isValidEmail(email);
        const admin = isEmail === true? await getAdminByEmail(email) : '';
        if(!admin) {
            return errorResponseAdmin(res, 'User not found', 200);
        }
        const isValidUser = await bcrypt.compare(password, admin.password);
        if (!isValidUser) {
            return errorResponseAdmin(res, 'Invalid Credentials', 200);
        }
        
        const token = generateToken({id:admin.id, role:'super_admin'});
        const adminDetails = {
            id: admin.id,
            name: admin.name,
            email: admin.email          
        };
        await lastLoginUpdate(admin.id);
        const result = {admin:adminDetails, _adminToken: token};
       // return successResponseAdmin(res, 'Login sucessfully', 200, result);
           return res.status(200).json({
            'success':true,'message':'Login sucessfully','data':adminDetails,'_adminToken':token
           })
    } catch(error: any) {
        return errorResponseAdmin(res, error.message);
    }
}

export const profile = async (req: Request, res: Response) => {
    try {
        const authUser = req.auth_user;
        return successResponseAdmin(res, 'Profile sucessfully', 200, authUser);
    } catch(error: any) {
        return errorResponseAdmin(res, error.message);
    }
}


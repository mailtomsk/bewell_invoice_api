import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt'
import { successResponse, errorResponseAdmin } from '../utils/response';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../interface';

const prisma = new PrismaClient()

interface DecodedToken {
    id: number;
    role: 'super_admin';
    iat?: number;
    exp?: number;
}

interface AdminInterface{
    id:number,
    name:string,
    email:string,
    role:string,
    status?:boolean,
    created_at?:string,
    updated_at?:string
}

declare global {
    namespace Express {
        interface Request {
            auth_user?: AdminInterface;
        }
    }
}


export const adminGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) 
        return errorResponseAdmin(res, 'Forbidden', 403);
    try {
        const {id , role} = verifyToken(token) as DecodedToken;
        
        if (role !== 'super_admin') {
            return errorResponseAdmin(res, 'Unauthorized', 401);
        }
        const admin  = await prisma.user.findUnique({
            where:{id},
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        });
        req.auth_user = admin;
        next();
    } catch (error : any){
        return errorResponseAdmin(res, 'Invalid token', 401);
    }
};
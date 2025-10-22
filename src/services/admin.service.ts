import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }        
    });
}
export const getAdminById = async (user_id: string) => {
    return await prisma.user.findUnique({
       where: { id: parseInt(user_id, 10) }       
    });
}
export const lastLoginUpdate = async ( data : any) => {
    return await prisma.user.update({
        where: { id: data },
        data: { last_login: new Date() },
    });
}


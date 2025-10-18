import { Response, Request, NextFunction } from 'express';

export interface Customer {
    full_name: string;
    email: string;
    mobile: string;
    password: string;
    confirm_password: string;
    drivers_license?: string;
}

export interface ServiceCenter {
    name: string;
    address: string;
    state: string;
    area: string;
    image: string;
    rating: number;
    total_reviews: number;
    working_hours_weekday: string; 
    working_hours_saturday: string; 
    working_hours_sunday: string; 
    status: 'active' | 'inactive';
}

export interface AuthenticatedRequest extends Request {
    auth_user?: any,
    file?: any,
    page?: number,
    keywords?:any,
}
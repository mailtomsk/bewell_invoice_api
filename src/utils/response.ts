import { Response } from "express"

interface GlobalResponse<T> {
    status: boolean;
    message: string;
    data?: T;
}

interface AdminResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export const successResponse = <T>(res: Response, message: string, statusCode: number = 200, data?: T) => {
    const response: GlobalResponse<T> = {
        status: true,
        message,
        data
    }
    res.status(statusCode).json(response)
}

export const errorResponse = <T>(res: Response, message: string, statusCode: number = 404, data?: T) => {
    const error_response: GlobalResponse<T> = {
        status: false,
        message,
        data
    }
    res.status(statusCode).json(error_response)
}


export const successResponseAdmin = <T>(res: Response, message: string, statusCode: number = 200, data?: T) => {
    const response: AdminResponse<T> = {
        success: true,
        message,
        data
    }
    res.status(statusCode).json(response)
}

export const errorResponseAdmin = <T>(res: Response, message: string, statusCode: number = 404, data?: T) => {
    const error_response: AdminResponse<T> = {
        success: false,
        message,
        data
    }
    res.status(statusCode).json(error_response)
}

/**
 * Date format like this
 * 
 * 8 May 2025
 */
export const dateFormat = (data : string, format?: string) => {
    let cDate = new Date(data);
    const formatted = cDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return formatted;
}

export const timeFormat = (data : string, format?: string) => {
    let cDate = new Date(data);
    const formatted = cDate.toLocaleDateString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return formatted;
}
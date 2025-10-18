import { Request, Response } from "express";
import { successResponseAdmin, errorResponseAdmin } from "../../utils/response";
import bcrypt from "bcrypt";
import { getStates, getStateCompilance, createState as createStateService, deleteState as deleteStateService, updateStateStatus as updateStateStatusService } from '../../services/admin.service';
import { verifyToken, generateToken } from "../../utils/jwt";

// Extend Express Request to include user property from auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export const states = async (req: Request, res: Response) => {
    try {
        const finalResult = await getStates();
        return successResponseAdmin(res, 'States List', 200, finalResult);
    } catch (error: any) {
        return errorResponseAdmin(res, 'Something Went wrong');
    }
}

export const statecompilance = async (req: Request, res: Response) => {
    try {
        const finalResult = await getStateCompilance();
        return successResponseAdmin(res, 'States List', 200, finalResult);
    } catch (error: any) {
        return errorResponseAdmin(res, 'Something Went wrong');
    }
}

export const createState = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { code, name, status, complianceCodes, formDocuments, rcgDocuments, sortOrder, submittedRate, totalReports } = req.body;
        const userId = req.user?.id || 'admin';

        if (!code || !name) {
            return errorResponseAdmin(res, 'State code and name are required', 400);
        }

        const stateData = {
            code,
            name,
            status: status || 'active',
            complianceCodes: complianceCodes || 0,
            formDocuments: formDocuments || 0,
            rcgDocuments: rcgDocuments || 0,
            sortOrder: sortOrder || 0,
            submittedRate: submittedRate || 0.0,
            totalReports: totalReports || 0,
            createdBy: userId
        };

        const result = await createStateService(stateData);
        return successResponseAdmin(res, 'State created successfully', 201, result);
    } catch (error: any) {
        console.error('Error in createState:', error);
        return errorResponseAdmin(res, error.message || 'Failed to create state', 500);
    }
}

export const deleteState = async (req: Request, res: Response) => {
    try {
        const { stateId } = req.params;

        if (!stateId) {
            return errorResponseAdmin(res, 'State ID is required', 400);
        }

        const result = await deleteStateService(parseInt(stateId));
        return successResponseAdmin(res, 'State deleted successfully', 200, result);
    } catch (error: any) {
        console.error('Error in deleteState:', error);
        return errorResponseAdmin(res, error.message || 'Failed to delete state', 500);
    }
}

export const updateStateStatus = async (req: Request, res: Response) => {
    try {
        const { stateId } = req.params;
        const { status } = req.body;

        if (!stateId || !status) {
            return errorResponseAdmin(res, 'State ID and status are required', 400);
        }

        const result = await updateStateStatusService(parseInt(stateId), status);
        return successResponseAdmin(res, 'State status updated successfully', 200, result);
    } catch (error: any) {
        console.error('Error in updateStateStatus:', error);
        return errorResponseAdmin(res, error.message || 'Failed to update state status', 500);
    }
}

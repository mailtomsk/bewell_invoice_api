import { Router, Request, Response, NextFunction } from 'express'

import { invoiceValidation,authAdminLoginValidation} from "../validation/admin.validation";

import { validate } from "../middlewares/validate";
import { createInvoice,getAllInvoices,uploadDocument,getAllVendors,
    updateInvoice } from "../controllers/admin/invoice.controller";
import { adminLogin} from "../controllers/admin/auth.controler";

import { adminGuard } from "../middlewares/authGuards.middleware";
import { successResponse, errorResponseAdmin } from "../utils/response";


const admin = Router();
admin.get('/', (req: Request, res: Response) => {
    return successResponse(res, `API Started Here`, 200, {});
});

admin.post('/login', authAdminLoginValidation, validate, adminLogin);
admin.post('/create_invoice', invoiceValidation, createInvoice)
admin.post('/update_invoice', invoiceValidation, updateInvoice)

admin.post('/upload_doc', invoiceValidation, uploadDocument)

admin.get('/invoices', getAllInvoices);
admin.get('/vendors', getAllVendors);


export default admin;
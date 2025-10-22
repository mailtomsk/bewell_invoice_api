import { Request, Response } from "express";
import { successResponseAdmin, errorResponseAdmin } from "../../utils/response";
import {parseDate} from "../../utils/lib";
import {InVoiceStoreService,InVoiceDetailsStoreService,listAllInvoices,lastInvoiceID,createVendor,getVendorId,updateInvoiceDoc} 
from "../../services/invoice.services"

import { upload } from "../../middlewares/upload";

import * as path from 'path';
import * as fs from 'fs';


export const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const finalResult = await listAllInvoices();
        return successResponseAdmin(res, 'Invoices List', 200, finalResult);
    } catch (error: any) {
        return errorResponseAdmin(res, 'Something Went wrong');
    }
}

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const detailsItems = req.body.items;
        const last = await lastInvoiceID();
        let  tranNo = 'INV00001';
        if(last){
           tranNo = `INV${String((last?.id || 0) + 1).padStart(5, '0')}`;
        }

      
        let dateInput = req.body.date;
        // if req.body.date is empty, null, or invalid → use current date
        let tranDate = new Date();
        if(dateInput){
            console.log(dateInput);
            tranDate = parseDate(dateInput);
        }
        let cleanedName ='';
        if(req.body.vendorName){           
            let vendorName = req.body.vendorName;
            cleanedName = vendorName.replace(/\n/g, ' ');                    
        }
        let vendor_address1='';
        let vendor_address2='';
        let phone='';
        let email='';
        if(req.body.vendorAddress){
             [vendor_address1, vendor_address2 = ''] = req.body.vendorAddress.split('\n').map((line: string) => line.trim());
        }        
        const vendorAry:any={
            name:cleanedName,
            phone:phone,
            email:email,
            address1:vendor_address1,
            address2:vendor_address2,
            created_by:"1"   
        }
        
        const existRes = await getVendorId(vendorAry);
        let vendorId = 0;
        if(existRes){
            vendorId = existRes.id;
        } else{
            const newVendor = await createVendor(vendorAry);
            vendorId = newVendor.id;
        
        }              
        if(vendorId){
            const HeaderDetails: any = {
            tran_no: tranNo,
            tran_date: tranDate,
            payment_date: tranDate,
            vendor_name: cleanedName,
            vendor_id:vendorId,
            vendor_address: req.body.vendorAddress,
            ref_no: req.body.invoiceNumber,
            payment_terms: req.body.paymentTerms,
            receiver_name:req.body.receiverName,
            receiver_address:req.body.receiverAddress,
            sub_total: req.body.total,
            gst: req.body.taxAmount,
            discount: 0,
            status:'paid',
            total: req.body.total,
            body_data:req.body,
            amount_paid: 0,
            amount_balance: 0,
            created_by:"1"           
            };
            const result = await InVoiceStoreService(HeaderDetails);
            if(result.id){
                const detailsData = detailsItems.map((item: any) => ({
                name: item.description,
                price: item.unitPrice,
                quantity: item.quantity,
                total_price: item.amount,
                header_id: result.id,
                tran_no: result.tran_no,
                created_by:"1",
                sno:1,
                sku:"0",
                })); 
                await InVoiceDetailsStoreService(detailsData);           
            }
            return successResponseAdmin(res, 'Created successfully', 200, result);
        }else{
             return errorResponseAdmin(res, 'Failed to create Vendor missing', 500);
        }
        
    } catch (error: any) {
        console.error('Error in create:', error);
        return errorResponseAdmin(res, error.message || 'Failed to create', 500);
    }
}

export const uploadDocument = async (req: Request, res: Response) => {
  
  // handle the multer middleware manually
  upload.single("invoice_doc")(req, res, async (err: any) => {
    try {
      if (err) {
        console.error("Multer error:", err);
        return errorResponseAdmin(res, err.message || "File upload failed", 400);
      }

      const { invoiceId } = req.body;

      if (!invoiceId) {
        return errorResponseAdmin(res, "invoiceId is required", 400);
      }

      if (!req.file) {
        return errorResponseAdmin(res, "No document uploaded", 400);
      }

      // 👉 Extract filename info
      const { filename, originalname, path: filePath } = req.file;

      // Optional: Save file info to DB here
       const docData = {invoiceId:parseInt(invoiceId,10),upload_doc: filename};
       await updateInvoiceDoc(docData);

      return successResponseAdmin(res, "Document uploaded successfully", 200, {
        invoiceId,
        filePath,
      });
    } catch (error: any) {
      console.error("Error in uploadDocument:", error);
      return errorResponseAdmin(res, error.message || "Failed to upload document", 500);
    }
  });
};
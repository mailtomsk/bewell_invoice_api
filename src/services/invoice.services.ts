import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const updateInvoiceDoc = async ( data : any) => {
    return await prisma.invoiceHeader.update({
        where: { id: data.invoiceId },
        data: { upload_doc: data.upload_doc },
    });
}

export const InVoiceStoreService = async(data: any) => {
 return await prisma.invoiceHeader.create({ data });
}

export const InVoiceDetailsStoreService = async(data: any) => {
    return await prisma.invoiceDetails.createMany({ data });
}

export const listAllInvoices = async () => {
    const invoices = await prisma.invoiceHeader.findMany({
    orderBy: { created_at: 'desc' },
    include: { details: true },
    });
    return invoices.map(({ body_data, ...rest }) => rest);
};

export const getVendorId=async(pdata:any) =>{
    // 1️⃣ Check if vendor exists
        let vendor;
        if(pdata.phone!=''){
            vendor = await prisma.vendor.findFirst({
                where: {
                OR: [
                    { name: pdata.name },
                    { phone: pdata.phone},
                ],
                },
            });
        }else{
            vendor = await prisma.vendor.findFirst({
            where: {
                name: {
                equals: pdata.name,
                mode: 'insensitive', // ignores case differences
                },
            },
            });
        }
        return vendor;
}
export const createVendor = async(data: any) => {
 return await prisma.vendor.create({ data });
}

export const lastInvoiceID = async () => {
    const last = await prisma.invoiceHeader.findFirst({
    select: { id: true },
    orderBy: { id: 'desc' },
    });
    return last;
};

export const listAllVendors = async () => {
    const vendors = await prisma.vendor.findMany({
    orderBy: { created_at: 'desc' },    
    });
    return vendors;
};
export const listVendorsWithStats = async () => {
  const vendorsWithStats = await prisma.vendor.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      invoices: {
        select: {
          total: true,
          status: true,
        },
      },
    },
  });

  // Map to include invoice count and total amount
  const result = vendorsWithStats.map((vendor) => {
    const invoiceCount = vendor.invoices.length;
    const totalAmount = vendor.invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
    return {
      id: vendor.id,
      name: vendor.name,
      phone: vendor.phone,
      email: vendor.email,
      invoiceCount,
      totalAmount,
    };
  });

  return result;
};

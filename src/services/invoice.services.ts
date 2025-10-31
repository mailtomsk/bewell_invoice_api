import { PrismaClient } from '@prisma/client';
import { startOfMonth } from 'date-fns';

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

export const inVoiceUpdateService = async ( data : any,invoiceNumber:number) => {
    
    return await prisma.invoiceHeader.update({
        where: { id: invoiceNumber },
        data: data,
    });
}

export const getInvoiceStats = async () => {
  // Start of the current month
  const monthStart = startOfMonth(new Date());

  // Run all counts/sums in parallel
  const [totalInvoices, totalAmount, paidInvoices, unpaidInvoices, thisMonthInvoices] =
    await Promise.all([
      prisma.invoiceHeader.count(),
      prisma.invoiceHeader.aggregate({
        _sum: { total: true },
      }),
      prisma.invoiceHeader.count({
        where: { status: 'paid' },
      }),
      prisma.invoiceHeader.count({
        where: { status: 'unpaid' },
      }),
      prisma.invoiceHeader.count({
        where: {
          tran_date: { gte: monthStart },
        },
      }),
    ]);

  return {
    totalInvoices,
    totalAmount: totalAmount._sum.total || 0,
    paidInvoices,
    unpaidInvoices,
    thisMonthInvoices,
  };
};
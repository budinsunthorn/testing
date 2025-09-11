import { OrderStatus } from "@prisma/client";

export const getSalesMoneyReport = async (context, args) => {
    // const result = await context.prisma.payment.aggregate({
    //     _sum: {
    //         amount: true,
    //         cost: true,
    //         changeDue: true,
    //         discount: true,
    //     },
    //     where: {
    //         payDate: {
    //             gte: args.dateFrom,
    //             lte: args.dateTo,
    //         },
    //     },
    // });
    return {
        amount: 0,
        cost: 0,
        changeDue: 0,
        discount: 0,
    }
}

export const getSalesIndexReport = async (context, args) => {
    const storeInfo = await context.prisma.dispensary.findUnique({
        select: {
            name: true,
            cannabisLicense: true
        },
        where: { id: args.dispensaryId },
    })
    const totalOrders = await context.prisma.order.count({
        where: {
            dispensaryId: args.dispensaryId,
            orderDate: {
                gte: args.dateFrom,
                lte: args.dateTo,
            },
        },
    }) || 0;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const structuredResponse = {
        storeName: storeInfo.name,
        cannabisLicense: storeInfo.cannabisLicense,
        totalOrders: totalOrders,
        dateCreated: formattedDate,
        dateFrom: args.dateFrom,
        dateTo: args.dateTo,
    };
    return structuredResponse
}

export const getPaymentCashReport = async (context, args) => {
    const result = await context.prisma.order.aggregate({
        _sum: {
            cashAmount: true,
            changeDue: true,
        },
        where: {
            dispensaryId: args.dispensaryId,
            status: OrderStatus.PAID,
            orderDate: {
                gte: args.dateFrom,
                lte: args.dateTo,
            },
        },
    });
    const structuredResponse = {
        cash: result._sum.cashAmount,
        changeDue: result._sum.changeDue,
        returns: 0,
    };
    return structuredResponse
}

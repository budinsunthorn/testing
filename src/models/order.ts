import { detectRuntime } from "@prisma/client/runtime/library"
import { throwUnauthorizedError, throwManualError } from '../index'
import { OrderStatus } from "@prisma/client"

export const getOrder = async (context, id) => {
    return context.prisma.order.findUnique({
        where: { id: id || undefined },
        include: {
            OrderItem: {
                orderBy: {
                    id: 'asc' // or 'desc' for descending order
                },
                include: {
                    product: {
                        include: {
                            itemCategory: true
                        }
                    }
                }
            },
            customer: true,
            dispensary: true,
            drawer: true,
            user: true
        }
    })
}

export const getOrderAndTax = async (context, id) => {
    try {
        return context.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: id || undefined },
                include: {
                    OrderItem: {
                        orderBy: {
                            id: 'asc' // or 'desc' for descending order
                        },
                        include: {
                            product: {
                                include: {
                                    itemCategory: true
                                }
                            },
                            TaxHistory: true
                        }
                    },
                    customerAmount: true,
                    instrumentAmount: true,
                    musicAmount: true,
                    organAmount: true,
                    doseAmount: true,
                    putAmount: true,
                    petAmount: true,
                    kitAmount: true,
                    curtainAmount: true,
                    womanAmount: true,
                    praiseAmount: true,
                    rapidAmount: true,
                    clownAmount: true,
                    facultyAmount: true,
                    dispensaryAmount: true,
                    drawerAmount: true,
                    userAmount: true,
                    DiscountHistory: true
                }
            })

            const tax = await context.prisma.taxHistory.aggregate({
                _sum: {
                    taxAmount: true,
                },
                where: {
                    orderId: id,
                },
            });

            return {
                order: order,
                tax: tax._sum.taxAmount || 0
            }
        })

    } catch (e) {
        console.log("ordertax error>>>", e)
    }
}

export const getAllOrdersByDispensaryIdAndDate = async (context, dispensaryId, orderDate) => {
    return context.prisma.order.findMany({
        where: {
            AND: [
                { dispensaryId: dispensaryId || undefined },
                { orderDate: orderDate || undefined },
            ]
        },
        include: {
            customer: true
        },
        orderBy: {
            id: 'asc',
        },
    })
}

export const getAllOrdersByDispensaryIdAndStatusAndOrderTypeAndSearchParamWithPages = async (context, args) => {

    const totalCount = await context.prisma.order.count({
        where: {
            dispensaryId: args.dispensaryId,
            ...(args.status && {
                status: args.status, // Only include if status is provided
            }),
            ...(args.orderType && {
                orderType: args.orderType, // Only include if status is provided
            }),
            ...(args.searchParam && {
                id: Number(args.searchParam), // Convert searchParam to Number
            }),
        },
    });
    const searchedOrders = await context.prisma.order.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            ...(args.status && {
                status: args.status, // Only include if status is provided
            }),
            ...(args.orderType && {
                orderType: args.orderType, // Only include if status is provided
            }),
            ...(args.searchParam && {
                id: Number(args.searchParam), // Convert searchParam to Number
            }),
        },
        skip: (args.pageNumber - 1) * args.onePageRecords,
        take: args.onePageRecords,
    })
    return {
        orders: searchedOrders,
        totalCount: totalCount
    }
}

export const getAllOrdersByDrawerId = async (context, drawerId) => {
    return context.prisma.order.findMany({
        where: {
            drawerId: drawerId,
            OR: [
                { status: OrderStatus.EDIT },
                { status: OrderStatus.PAID },
                { status: OrderStatus.HOLD },
            ]
        },
        include: {
            customer: true,
            DiscountHistory: true
        },
        orderBy: {
            id: 'asc',
        },
    })
}

export const getSmallOrdersByDrawerId = async (context, drawerId) => {
    return context.prisma.order.findMany({
        where: {
            drawerId: drawerId,
            OR: [
                { status: OrderStatus.EDIT },
                { status: OrderStatus.PAID },
                { status: OrderStatus.HOLD },
            ]
        },
        include: {
            customer: true,
            DiscountHistory: true
        },
        orderBy: {
            id: 'asc',
        },
    })
}

export const getPartOrdersByDrawerId = async (context, drawerId) => {
    return context.prisma.order.findMany({
        where: {
            drawerId: drawerId,
            OR: [
                { status: OrderStatus.EDIT },
                { status: OrderStatus.PAID },
                { status: OrderStatus.HOLD },
            ]
        },
        include: {
            customer: true,
            DiscountHistory: true
        },
        orderBy: {
            id: 'asc',
        },
    })
}

export const getAllOrdersForCurrentDrawer = async (context, args) => {

    const getDrawer = await context.prisma.drawer.findMany({
        where: {
            dispensaryId: args.input.dispensaryId,
            userId: args.input.userId,
            isUsing: true,
        },
    })
    if (getDrawer.length === 0) return throwManualError(400, 'No started Drawer.')
    const drawerId = getDrawer[0].id
    return context.prisma.order.findMany({
        where: {
            drawerId: drawerId,
            OR: [
                { status: OrderStatus.EDIT },
                { status: OrderStatus.PAID },
            ]
        },
        include: {
            customer: true
        },
        orderBy: {
            id: 'asc',
        },
    })
}

export const getOrderNumbersByDispensaryIdAndCustomerIdWithPages = async (context, args) => {
    const totalCount = await context.prisma.order.count({
        where: {
            dispensaryId: args.dispensaryId,
            customerId: args.customerId,
            status: OrderStatus.PAID
        },
    });
    const orderNumbers = await context.prisma.order.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            customerId: args.customerId,
            status: OrderStatus.PAID
        },
        select: {
            id: true,
            createdAt: true,
            cashAmount: true,
            otherAmount: true,
            changeDue: true
        },
        orderBy: {
            id: 'desc',
        },
        skip: (args.pageNumber - 1) * args.onePageRecords,
        take: args.onePageRecords,
    })

    const result = orderNumbers.map(order => ({
        id: order.id,
        orderDate: order.createdAt,
        amount: order.cashAmount + order.otherAmount - order.changeDue,
    }));

    return {
        orderHistory: result,
        totalCount: totalCount
    }
}



import { DropType, DrawerStatus } from "@prisma/client";

export const getCurrentDrawerByUserId = async (context, userId) => {
    return context.prisma.drawer.findMany({
        where: {
            userId: userId,
            status: DrawerStatus.PENDING
        },
        orderBy: { id: "asc" },
    })
}

export const getUsingDrawersByDispensaryId = async (context, dispensaryId) => {
    try {
        return context.prisma.drawer.findMany({
            where: {
                dispensaryId: dispensaryId,
                status: DrawerStatus.PENDING
            },
            include: {
                user: true
            },
            orderBy: { register: "asc" },
        })
    } catch (error) {
        console.log("error>>>>>", error)
    }
}

export const getUsingDrawer = async (context, args) => {
    const usingDrawer = await context.prisma.drawer.findMany({
        where: {
            userId: args.userId,
            dispensaryId: args.dispensaryId,
            isUsing: true
        },
        include: {
            Order: true
        }
    })

    const sumCashAmount = usingDrawer.reduce((sum, item) => {
        return sum + item.Order.reduce((orderSum, order) => orderSum + (order.cashAmount || 0), 0);
    }, 0);

    const sumChangeDue = usingDrawer.reduce((sum, item) => {
        return sum + item.Order.reduce((orderSum, order) => orderSum + (order.changeDue || 0), 0);
    }, 0);

    const drawerId = usingDrawer[0].id

    const dropIn = await context.prisma.moneyDrop.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            drawerId: drawerId,
            dropType: DropType.IN
        },
    });

    const dropOut = await context.prisma.moneyDrop.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            drawerId: drawerId,
            dropType: DropType.OUT
        },
    });
    const dropInMoney = dropIn._sum.amount | 0
    const dropOutMoney = dropOut._sum.amount | 0

    const cashBalance = sumCashAmount - sumChangeDue + dropInMoney - dropOutMoney
    const numberOfOrders = usingDrawer[0].Order.length
    const usingDrawerDataIndex = {
        id: usingDrawer[0].id,
        register: usingDrawer[0].register,
        startedAt: usingDrawer[0].createdAt,
        cashBalance: cashBalance,
        numberOfOrders: numberOfOrders,
    }
    return usingDrawerDataIndex
}
import { DiscountMethod } from "@prisma/client";
export const getDiscountById = async (context, id) => {
    return context.prisma.discount.findUnique({
        where: { id: id || undefined },
    })
}

export const getAllDiscountsByDispensaryId = async (context, dispensaryId) => {
    if (dispensaryId === 0) {
        return context.prisma.discount.findMany({
            orderBy: { id: "asc" },
        })
    } else {
        return context.prisma.discount.findMany({
            where: { dispensaryId: dispensaryId || undefined },
            orderBy: { id: "asc" },
        })
    }
}

export const setDiscountForOrderItems = async (tx, orderId, discountMethod, discountValue, baseAmount) => {
    const totalSum = await tx.orderItem.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            orderId: orderId,
        },
    });
    const totalAmount = totalSum._sum.amount + baseAmount || 0
    const orderItems = await tx.orderItem.findMany({
        where: {
            orderId: orderId
        }
    })
    let discountedAmount = 0
    if (discountMethod == DiscountMethod.BYPERCENT) {
        discountedAmount = baseAmount * discountValue / 100
        for (const item of orderItems) {
            await tx.orderItem.update({
                data: {
                    discountedAmount: item.amount * discountValue / 100,
                },
                where: {
                    id: item.id
                }
            });
        }
    }
    if (discountMethod == DiscountMethod.BYAMOUNT) {
        discountedAmount = totalAmount == 0 ? 0 : discountValue * baseAmount / totalAmount
        for (const item of orderItems) {
            await tx.orderItem.update({
                data: {
                    discountedAmount: totalAmount == 0 ? 0 : discountValue * item.amount / totalAmount,
                },
                where: {
                    id: item.id
                }
            });
        }
    }
    if (discountMethod == DiscountMethod.TOAMOUNT) {
        discountedAmount = totalAmount == 0 ? 0 : baseAmount - discountValue * baseAmount / totalAmount
        for (const item of orderItems) {
            await tx.orderItem.update({
                data: {
                    discountedAmount: totalAmount == 0 ? 0 : item.amount - discountValue * item.amount / totalAmount,
                },
                where: {
                    id: item.id
                }
            });
        }
    }

    return discountedAmount
}
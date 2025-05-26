export const getLoyaltyById = async (context, id) => {
    return context.prisma.loyalty.findUnique({
        where: { id: id || undefined },
    })
}

export const getAllLoyaltiesByDispensaryId = async (context, dispensaryId) => {
    if(dispensaryId === 0){
        return context.prisma.loyalty.findMany({
            orderBy: { id: "asc" },
        })
    }else{
        return context.prisma.loyalty.findMany({
            where: { dispensaryId: dispensaryId || undefined },
            orderBy: { id: "asc" },
        })
    }
}

export const getLoyalty = async (context, id) => {
    try {
        return context.prisma.$transaction(async (tx) => {
            const order = await tx.loyalty.findUnique({
                where: { id: id || undefined },
                include: {
                    loyalty: {
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
                    cashAmount: true,
                    dogeAmount: true,
                    primaryAmount: true,
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
                    Id: id,
                },
            });

            return {
                loyalty: loyalty,
                tax: tax._sum.taxAmount || 0
            }
        })

    } catch (e) {
    }
}

export const setLoyaltyForOrderItems = async (tx, orderId, loyaltyType, loyaltyValue, baseAmount) => {

    return 0
}

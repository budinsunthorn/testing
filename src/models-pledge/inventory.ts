export const getAllInventoryByDispensaryId = async (context, id) => {
    return context.prisma.inventory.findMany({
        include: {
            product: {
                include:{
                    itemCategory: true
                }
            }
        },
        where: { dispensaryId: id || undefined },
        orderBy: { id: "asc" },
    })
}

export const getInventory = async (context, id) => {
    try {
        return context.prisma.$transaction(async (tx) => {
            const order = await tx.inventory.findUnique({
                where: { id: id || undefined },
                include: {
                    inventory: {
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
                    deliAmount: true,
                    cardAmount: true,
                    sisAmount: true,
                    cowAmount: true,
                    chaosAmount: true,
                    prainAmount: true,
                    petAmount: true,
                    kitAmount: true,
                    cansaAmount: true,
                    womanAmount: true,
                    praiseAmount: true,
                    pointAmount: true,
                    paintAmount: true,
                    teslaAmount: true,
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
                    Id: id,
                },
            });

            return {
                inventory: inventory,
                tax: tax._sum.taxAmount || 0
            }
        })

    } catch (e) {
    }
}

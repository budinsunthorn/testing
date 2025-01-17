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

export const setLoyaltyForOrderItems = async (tx, orderId, loyaltyType, loyaltyValue, baseAmount) => {

    return 0
}

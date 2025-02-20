export const getCustomerById = async (context, id) => {
    return context.prisma.customer.findUnique({
        where: { id: id || undefined },
        include: {
            Order: {
                where: {
                    status: "PAID"
                },
                orderBy: { id: "desc" }
            }
        }
    })
}

export const getAllCustomersByDispensaryId = async (context, dispensaryId) => {
    if (dispensaryId === 0) {
        return context.prisma.customer.findMany({
            orderBy: { id: "asc" },
        })
    } else {
        return context.prisma.customer.findMany({
            where: { dispensaryId: dispensaryId || undefined },
            orderBy: { id: "asc" },
        })
    }
}

export const getAllCustomerQueueByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.customerQueue.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        include: {
            customer: true
        },
        orderBy: { id: "asc" },
    })
}

export const checkIsCustomerInQueue = async (context, customerId) => {
    const res = await context.prisma.customerQueue.count({
        where: { customerId: customerId || undefined },
    })
    return {
        count: res
    }
}
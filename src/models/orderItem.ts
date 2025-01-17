export const getAllOrderItemsByOrderId = async (context, orderId) => {
    return context.prisma.orderItem.findMany({
        include: {
            product: {
                include: {
                    name: true,
                    stock: true,
                    unitOfMeasure: true,
                    itemCategory: {
                        include: {
                            name: true,
                            color: true,
                            metrcCategory: true
                        }
                    }
                }
            }
        },
        where: { orderId: orderId },
        orderBy: {
            id: 'asc',
        },
    })
}
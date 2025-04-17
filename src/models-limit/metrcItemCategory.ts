export const getMetrcItemCategoryByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.metrcItemCategory.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}

export const getAllMetrcItemCategoryByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.metrcItemCategory.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}


export const getSmallMetrcItemCategoryByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.metrcItemCategory.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}
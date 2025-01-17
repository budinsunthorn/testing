export const getMetrcItemCategoryByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.metrcItemCategory.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}
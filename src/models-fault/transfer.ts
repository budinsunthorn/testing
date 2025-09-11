export const getTransfersByDispensaryIdAndTransferTypeAndStatus = async (context, args) => {
    return context.prisma.transfer.findMany({
        include: {
            user: true
        },
        where: {
            dispensaryId: args.dispensaryId,
            ...(args.transferType && {
                transferType: args.transferType, // Only include if transferType is provided
            }),
            ...(args.status && {
                status: args.status, // Only include if status is provided
            }),
        },
        orderBy: { id: 'desc' },
    })
}
export const getTransfersByDispensaryIdAndTransferTypeAndStatusWithPages = async (context, args) => {
    const totalCount = await context.prisma.transfer.count({
        where: {
            dispensaryId: args.dispensaryId,
            ...(args.transferType && {
                transferType: args.transferType, // Only include if transferType is provided
            }),
            ...(args.status && {
                status: args.status, // Only include if status is provided
            }),
            ShipperFacilityName: {
                contains: args.searchParam,
                mode: 'insensitive', // Optional: makes the search case-insensitive
            },
        },
    });
    const searchedTransfers = await context.prisma.transfer.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            ...(args.transferType && {
                transferType: args.transferType, // Only include if transferType is provided
            }),
            ...(args.status && {
                status: args.status, // Only include if status is provided
            }),
            ShipperFacilityName: {
                contains: args.searchParam,
                mode: 'insensitive' // Optional: makes the search case-insensitive
            },
        },
        orderBy: { id: 'desc' },
        skip: (args.pageNumber - 1) * args.onePageRecords,
        take: args.onePageRecords,
    })
    return {
        transfers: searchedTransfers,
        totalCount: totalCount
    }
}

export const getTransferById = async (context, args) => {
    return context.prisma.transfer.findUnique({
        include: {
            user: true
        },
        where: {
            id: args.id
        },
    })
}

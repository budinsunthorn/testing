
export const getPackageById = async (context, id) => {
    return context.prisma.package.findUnique({
        where: { id: id || undefined },
    })
}

export const getPackageByPackageId = async (context, packageId) => {
    return context.prisma.package.findUnique({
        where: { packageId: packageId || undefined },
    })
}

export const getPackageByLabel = async (context, label) => {
    return context.prisma.package.findUnique({
        where: { packageLabel: label || undefined },
    })
}

export const getAllPackagesByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.package.findMany({
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}

export const getAllPackagesByDispensaryIdWithPages = async (context, args) => {
    const totalCount = await context.prisma.package.count({
        where: {
            dispensaryId: args.dispensaryId,
            itemName: {
                contains: args.searchParam,
                mode: 'insensitive', // Optional: makes the search case-insensitive
            },
        },
    });
    const searchedPackages = await context.prisma.package.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            itemName: {
                contains: args.searchParam,
                mode: 'insensitive' // Optional: makes the search case-insensitive
            },
        },
        orderBy: { id: "asc" },
        skip: (args.pageNumber - 1) * args.onePageRecords,
        take: args.onePageRecords,
    })
    return {
        packages: searchedPackages,
        totalCount: totalCount
    }
}

export const getPackagesByDispensaryIdAndStatus = async (context, args) => {
    return context.prisma.package.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            packageStatus: args.status
        },
        orderBy: { id: "asc" },
    })
}

export const getPackageRowsByItemSearch = async (context, args) => {
    return context.prisma.package.findMany({
        where: {
            dispensaryId: args.dispensaryId,  // Replace with the actual dispensaryId variable
            itemName: {
                contains: args.searchQuery,        // Replace with the actual itemName variable
                mode: 'insensitive',        // Optional: makes the search case insensitive
            },
        },
        orderBy: { id: "asc" },
        take: 10,
    })
}

export const getPackagesByDeliveryId = async (context, args) => {
    return context.prisma.deliveryPackages.findMany({
        where: {
            deliveryId: args.deliveryId,
        },
        orderBy: { id: "asc" },
        include: {
            package: true
        }
    })
}

export const getPackagesByConnectedProductId = async (context, args) => {
    return context.prisma.package.findMany({
        where: {
            productId: args.productId,
        },
        orderBy: { id: "asc" },
    })
}

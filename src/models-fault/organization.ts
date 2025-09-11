export const getOrganizationById = async (context, id) => {
    return context.prisma.organization.findUnique({
        where: { id: id || undefined },
    })
}

export const getAllOrganizations = async (context) => {
    return context.prisma.organization.findMany({
        orderBy: { id: "asc" },
    })
}

export const getBigOrganizations = async (context) => {
    return context.prisma.organization.findMany({
        orderBy: { id: "asc" },
    })
}
import { UserType} from "@prisma/client";

export const getUserById = async (context, id) => {
    return context.prisma.user.findUnique({
        include: {
            dispensary: true,
          },
        where: {
            id: id || undefined,
            NOT: { userType: UserType.SUPER_ADMIN_MANAGER_USER },
        }
    })
}

export const getAllUsersByDispensaryId = async (context, dispensaryId) => {
    if (dispensaryId === 'all') {
        return context.prisma.user.findMany({
            include: {
                dispensary: true,
            },
            where: {
                NOT: {
                    userType: UserType.SUPER_ADMIN_MANAGER_USER
                },
            },
            orderBy: { id: 'asc' },
        })
    } else {
        return context.prisma.user.findMany({
            include: {
                dispensary: true,
            },
            where: {
                dispensaryId: dispensaryId || undefined,
                NOT: {
                    userType: UserType.SUPER_ADMIN_MANAGER_USER
                },
            },
            orderBy: { id: 'asc' },
        })
    }
}

export const getAdmins = async (context) => {
    return context.prisma.user.findMany({
        where: { userType: UserType.SUPER_ADMIN_MANAGER_USER },
        orderBy: { id: 'asc' },
    })
}
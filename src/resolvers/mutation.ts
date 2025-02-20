import { UserType, DrawerStatus, PackageStatus, OrderStatus, OrderType, TaxSettingApplyTo, DiscountMethod } from "@prisma/client";
import { MutationResolvers } from '../generated/graphql'
import dotenv from "dotenv";
import { PrismaClient, Prisma } from '@prisma/client'
dotenv.config();
import { GraphQLError, UniqueDirectivesPerLocationRule } from 'graphql';
import { throwUnauthorizedError, throwManualError } from '../index'
var chunk = require('chunk')
import * as metrcModel from '../models-village/metrc'
import * as supplierModel from '../models-village/supplier'
import * as taxSetting from '../models-village/taxSetting'
import * as discountModel from '../models-village/discount'
import * as loyaltyModel from '../models-village/loyalty'
import { resolve } from "path";
import { rejects } from "assert";

const duplicate_array = {
    ['name']: 'Name',
    ['phone']: 'Phone Number',
    ['email']: 'Email',
    ['cannabisLicense']: 'Cannabis License',
    ['metrcApiKey']: 'Metrc API Key',
    ['driverLicense']: 'Driver License',
    ['medicalLicense']: 'Medical License',
    ['businessLicense']: 'Business License',
    ['sku']: 'SKU',
    ['upc']: 'UPC',
    ['organizationId']: 'object in one organization',
    ['dispensaryId']: 'object in one dispensary',
    ['stateOfUsa']: 'object in one state',
    ['applyTarget']: 'discount',
}

const handlePrismaError = (e) => {
    let field = ''
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e)
        switch (e.code) {
            case 'P2002':
                if (e.meta?.target) field = e.meta.target[0]
                throw new GraphQLError('duplicate', {
                    extensions: {
                        code: 409,
                        msg: 'Duplicated ' + duplicate_array[field]
                        // msg: 'Duplicated Value'
                    },
                });
            case 'P2003':
                if (e.meta?.target) field = e.meta.target[0]
                throw new GraphQLError('hasChildren', {
                    extensions: {
                        code: 406,
                        msg: 'Can not be processed.'
                    },
                });
            default:
                throw new GraphQLError('hasChildren', {
                    extensions: {
                        code: 500,
                        msg: 'Your request has been denied.'
                    },
                });
        }
    }
}

export const Mutation = {
    createOrganization: async (_parent, _args, context) => {

        if (context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) {
            try {
                const creation = await context.prisma.organization.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createDispensary: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const creation = await context.prisma.dispensary.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createSupplier: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const creation = await context.prisma.supplier.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createMoneyDrop: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const creation = await context.prisma.moneyDrop.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createUser: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const creation = await context.prisma.user.create({
                    data: _args.input
                });
                return creation
            } catch (e) {
                console.log(e)
                handlePrismaError(e)
            }
        } else return throwUnauthorizedError()
    },
    createAdmin: async (_parent, _args, context) => {
        if (context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) {
            try {
                const creation = await context.prisma.user.create({
                    data: _args.input
                });
                return creation
            } catch (e) {
                handlePrismaError(e)
            }
        } else return throwUnauthorizedError()
    },
    createCustomer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const creation = await context.prisma.customer.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    startDrawer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const drawerCount = await context.prisma.drawer.count({
                where: {
                    dispensaryId: _args.input.dispensaryId,
                    register: _args.input.register,
                    status: DrawerStatus.PENDING
                },
            })
            if (drawerCount > 0) return throwManualError(400, 'Can not start duplicate register.')

            try {
                return context.prisma.$transaction(async (tx) => {
                    const preUpdating = await tx.drawer.updateMany({
                        where: {
                            dispensaryId: _args.input.dispensaryId,
                            register: {
                                not: _args.input.register,
                            },
                        },
                        data: {
                            isUsing: false,
                        },
                    });
                    const creation = await tx.drawer.create({
                        data: _args.input
                    });
                    return creation;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createProduct: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const creation = await context.prisma.product.create({
                    data: {
                        dispensaryId: _args.input.dispensaryId,
                        userId: _args.input.userId,
                        supplierId: _args.input.supplierId,
                        itemCategoryId: _args.input.itemCategoryId,
                        name: _args.input.name,
                        sku: _args.input.sku,
                        upc: _args.input.upc,
                        price: _args.input.price,
                        unitOfMeasure: _args.input.unitOfMeasure,
                        unitWeight: _args.input.unitWeight,
                        netWeight: _args.input.netWeight,
                    }
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createLoyalty: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const creation = await context.prisma.loyalty.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createDiscount: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const creation = await context.prisma.discount.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createItemCategory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const creation = await context.prisma.itemCategory.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createTaxSetting: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const creation = await context.prisma.taxSetting.create({
                    data: _args.input
                });

                const updateMjTaxApply = await taxSetting.updateTaxApply(context, _args.input.dispensaryId, TaxSettingApplyTo.MJ)
                const updateNmjTaxApply = await taxSetting.updateTaxApply(context, _args.input.dispensaryId, TaxSettingApplyTo.NMJ)

                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const getDrawer = await context.prisma.drawer.findMany({
                where: {
                    dispensaryId: _args.input.dispensaryId,
                    userId: _args.input.userId,
                    isUsing: true,
                },
            })
            if (getDrawer.length === 0) return throwManualError(400, 'Please start Drawer.')
            const drawerId = getDrawer[0].id
            try {
                const creation = await context.prisma.order.create({
                    data: {
                        dispensaryId: _args.input.dispensaryId,
                        userId: _args.input.userId,
                        status: _args.input.status,
                        orderDate: _args.input.orderDate,
                        drawerId: drawerId,
                    }
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createInventory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const creation = await context.prisma.inventory.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createCustomerQueue: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const creation = await context.prisma.customerQueue.create({
                    data: _args.input
                });
                return creation;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    createOrderItem: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            // Check if RETURN or not
            const order = await context.prisma.order.findUnique({
                where: { id: _args.input.orderId || undefined },
            })
            if (order.orderType === OrderType.RETURN) return throwManualError(400, "The Order #" + _args.input.orderId + " is RETURN type. Can not add items.")
            // Check if RETURN or not

            const dispensaryId = order.dispensaryId
            const orderId = order.id

            // Get Tax Info
            const product = await context.prisma.product.findUnique({
                where: { id: _args.input.productId || undefined },
                include: {
                    itemCategory: true
                }
            })
            const fundAmount = product.price * _args.input.quantity
            const applyTo = product.itemCategory.containMj ? TaxSettingApplyTo.MJ : TaxSettingApplyTo.NMJ
            if (order.mjType !== "NONE" && order.mjType !== applyTo) {
                return throwManualError(400, "MJ and non-MJ products can not be included in the same order.")
            }
            const taxApply = await context.prisma.taxApply.findMany({
                where: {
                    dispensaryId: dispensaryId,
                    applyTo: applyTo
                },
            })

            try {
                return context.prisma.$transaction(async (tx) => {

                    // Set order type
                    const updateOrderMjType = await tx.order.update({
                        data: {
                            mjType: applyTo
                        },
                        where: {
                            id: orderId,
                        },
                    });

                    // Get Discount Info
                    const discountHistory = await tx.discountHistory.findMany({
                        where: { orderId: orderId || undefined },
                    })

                    const baseAmount = _args.input.quantity * _args.input.price
                    let discountedAmount = 0
                    if (discountHistory.length > 0) {
                        discountedAmount = await discountModel.setDiscountForOrderItems(tx, orderId, discountHistory[0].discountMethod, discountHistory[0].value, baseAmount)
                    }
                    // Create order item
                    const creation = await tx.orderItem.create({
                        data: {
                            orderId: _args.input.orderId,
                            productId: _args.input.productId,
                            quantity: _args.input.quantity,
                            price: _args.input.price,
                            cost: _args.input.cost,
                            amount: baseAmount,
                            discountedAmount: discountedAmount
                        }
                    });
                    const orderItemId = creation.id;

                    // Set Tax
                    for (const item of taxApply) {
                        await tx.taxHistory.create({
                            data: {
                                dispensaryId: dispensaryId,
                                orderId: orderId,
                                orderItemId: orderItemId,
                                taxName: item.taxName,
                                taxPercent: item.basePercent,
                                compoundPercent: item.compoundPercent,
                                taxAmount: fundAmount * item.compoundPercent / 100
                            }
                        });
                    }
                    return creation;
                });
            } catch (e) {
                handlePrismaError(e);
            }
        }
        else return throwUnauthorizedError()
    },
    createOrderItemForReturn: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const order = await context.prisma.order.findUnique({
                where: { id: _args.input.orderId || undefined },
            })
            if (order.orderType === OrderType.SALE) return throwManualError(400, "The Order #" + _args.input.orderId + " is SALE type.")

            try {
                return context.prisma.$transaction(async (tx) => {
                    const creation = await tx.orderItem.create({
                        data: _args.input
                    })
                    return creation;
                });
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    completeOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {

                    const items = await tx.orderItem.findMany({
                        where: {
                            orderId: _args.input.orderId,
                        },
                        select: {
                            productId: true,
                            quantity: true
                        }
                    })
                    const updateStock = async (productId: string, quantity: number) => {
                        try {
                            await tx.product.update({
                                where: {
                                    id: productId,
                                },
                                data: {
                                    stock: {
                                        decrement: quantity
                                    },
                                }
                            })
                        } catch (err) {
                            console.log("::err", err)
                        } finally {
                            // console.log("::ended subaction")
                        }
                    }
                    await Promise.all(items.map((item: any) => updateStock(item.productId, item.quantity)))

                    const updating = await tx.order.update({
                        where: {
                            id: _args.input.orderId,
                        },
                        data: {
                            status: OrderStatus.PAID,
                            cashAmount: _args.input.amount,
                            otherAmount: _args.input.otherAmount,
                            changeDue: _args.input.changeDue,
                            discount: _args.input.discount,
                            cost: _args.input.cost,
                        }
                    });
                    return updating
                });
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    setDiscountForOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const creation = await tx.discountHistory.create({
                        data: _args.input
                    });
                    let discountedAmount = 0
                    discountedAmount = await discountModel.setDiscountForOrderItems(tx, _args.input.orderId, _args.input.discountMethod, _args.input.value, 0)
                    return creation
                });
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    setLoyaltyForOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const creation = await tx.loyaltyHistory.create({
                        data: _args.input
                    });
                    let loyaltyAmount = 0
                    loyaltyAmount = await loyaltyModel.setLoyaltyForOrderItems(tx, _args.input.orderId, _args.input.loyaltyType, _args.input.value, 0)
                    return creation
                });
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    returnOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const items = await tx.orderItem.findMany({
                        where: {
                            orderId: _args.input.orderId,
                            isRestockForReturn: true
                        },
                        select: {
                            productId: true,
                            quantity: true
                        }
                    })
                    const updateStock = async (productId: string, quantity: number) => {
                        try {
                            await tx.product.update({
                                where: {
                                    id: productId,
                                },
                                data: {
                                    stock: {
                                        increment: quantity
                                    },
                                }
                            })
                        } catch (err) {
                            console.log("::err", err)
                        } finally {
                            // console.log("::ended subaction")
                        }
                    }
                    await Promise.all(items.map((item: any) => updateStock(item.productId, item.quantity)))

                    const updating = await tx.order.update({
                        where: {
                            id: _args.input.orderId,
                        },
                        data: {
                            status: OrderStatus.PAID,
                            cashAmount: _args.input.amount,
                            changeDue: _args.input.changeDue,
                            discount: _args.input.discount,
                            cost: _args.input.cost,
                            returnReason: _args.input.returnReason,

                        }
                    });
                    return updating
                });
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateOrganization: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const updating = await context.prisma.organization.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        phone: _args.input.phone,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateDispensary: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.dispensary.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        dispensaryType: _args.input.dispensaryType,
                        cannabisLicense: _args.input.cannabisLicense,
                        cannabisLicenseExpireDate: _args.input.cannabisLicenseExpireDate,
                        businessLicense: _args.input.businessLicense,
                        phone: _args.input.phone,
                        email: _args.input.email,
                        locationAddress: _args.input.locationAddress,
                        locationCity: _args.input.locationCity,
                        locationState: _args.input.locationState,
                        locationZipCode: _args.input.locationZipCode,
                        isActive: _args.input.isActive,
                        isCustomerAgeVerify: _args.input.isCustomerAgeVerify,
                        customerAgeLimit: _args.input.customerAgeLimit,
                        storeTimeZone: _args.input.storeTimeZone,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateSupplier: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const updating = await context.prisma.supplier.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        supplierType: _args.input.supplierType,
                        businessLicense: _args.input.businessLicense,
                        UBI: _args.input.UBI,
                        phone: _args.input.phone,
                        email: _args.input.email,
                        locationAddress: _args.input.locationAddress,
                        locationCity: _args.input.locationCity,
                        locationState: _args.input.locationState,
                        locationZipCode: _args.input.locationZipCode,
                        isActive: _args.input.isActive
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateUser: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.user.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        userType: _args.input.userType,
                        email: _args.input.email,
                        name: _args.input.name,
                        phone: _args.input.phone,
                        isActive: _args.input.isActive,
                        isOrganizationAdmin: _args.input.isOrganizationAdmin,
                        isDispensaryAdmin: _args.input.isDispensaryAdmin,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateAdmin: async (_parent, _args, context) => {
        if (context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) {
            try {
                const updating = await context.prisma.user.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        userType: _args.input.userType,
                        email: _args.input.email,
                        name: _args.input.name,
                        phone: _args.input.phone,
                        isActive: _args.input.isActive,
                        isOrganizationAdmin: _args.input.isOrganizationAdmin,
                        isDispensaryAdmin: _args.input.isDispensaryAdmin,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateCustomer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const updating = await context.prisma.customer.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        MFType: _args.input.MFType,
                        birthday: _args.input.birthday,
                        email: _args.input.email,
                        phone: _args.input.phone,
                        isActive: _args.input.isActive,
                        driverLicense: _args.input.driverLicense,
                        driverLicenseExpirationDate: _args.input.driverLicenseExpirationDate,
                        isMedical: _args.input.isMedical,
                        medicalLicense: _args.input.medicalLicense,
                        medicalLicenseExpirationDate: _args.input.medicalLicenseExpirationDate,
                        status: _args.input.status,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateOrderToReturn: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {

            const itemCount = await context.prisma.orderItem.count({
                where: {
                    orderId: _args.input.orderId,
                },
            });

            if (itemCount > 0) return throwManualError(400, "To be a Return type order please remove all products in the order #" + _args.input.orderId + ". Or you can create a new order")

            try {
                const updating = await context.prisma.order.update({
                    where: {
                        id: _args.input.orderId,
                    },
                    data: {
                        orderType: OrderType.RETURN,
                        originalOrder: _args.input.originalOrderId
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    setRestockForOrderItem: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const updating = await context.prisma.orderItem.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        isRestockForReturn: _args.input.trueFalse
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    holdOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const updating = await context.prisma.order.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        status: OrderStatus.HOLD,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    cancelOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const order = await context.prisma.order.findUnique({
                where: {
                    id: _args.input.id
                }
            })
            if (order.status !== OrderStatus.EDIT) return throwManualError(400, "Only EDIT status orders can be cancelled.")
            try {
                const deletionItems = await context.prisma.orderItem.deleteMany({
                    where: {
                        orderId: _args.input.id,
                    },
                });
                const deletion = await context.prisma.order.delete({
                    where: {
                        id: _args.input.id,
                    },
                });
                return deletion;
            } catch (e) {
                console.log(e)
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    unHoldOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const updating = await context.prisma.order.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        status: OrderStatus.EDIT,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    voidOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            const order = await context.prisma.order.findUnique({
                where: {
                    id: _args.input.id
                }
            })
            if (order.status !== OrderStatus.PAID) return throwManualError(400, "The order #" + _args.input.id + " can not be voided.")

            try {
                return context.prisma.$transaction(async (tx) => {
                    const items = await tx.orderItem.findMany({
                        where: {
                            orderId: _args.input.id,
                        },
                        select: {
                            productId: true,
                            quantity: true
                        }
                    })
                    const updateStock = async (productId: string, quantity: number) => {
                        try {
                            await tx.product.update({
                                where: {
                                    id: productId,
                                },
                                data: {
                                    stock: {
                                        increment: quantity
                                    },
                                }
                            })
                        } catch (err) {
                            console.log("::err", err)
                        } finally {
                            // console.log("::ended subaction")
                        }
                    }
                    await Promise.all(items.map((item: any) => updateStock(item.productId, item.quantity)))

                    const currentDateTime = new Date();
                    const updating = await tx.order.update({
                        where: {
                            id: _args.input.id,
                        },
                        data: {
                            status: OrderStatus.VOID,
                            voidReason: _args.input.voidReason,
                            voidedAt: currentDateTime.toISOString(),
                        }
                    });
                    return updating;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    endDrawer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const editCount = await context.prisma.order.count({
                where: {
                    status: OrderStatus.EDIT,
                    drawerId: _args.input.id
                },
            });

            if (editCount > 0) return throwManualError(400, "There are EDIT orders in the current Register")
            try {
                const updating = await context.prisma.drawer.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        endAmount: _args.input.endAmount,
                        cashSales: _args.input.cashSales,
                        comment: _args.input.comment,
                        status: DrawerStatus.COMPLETED,
                        isUsing: false,
                    }
                });

                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    setUsingRegister: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const preUpdating = await tx.drawer.updateMany({
                        where: {
                            id: {
                                not: _args.input.id,
                            },
                        },
                        data: {
                            isUsing: false,
                        },
                    });
                    const updating = await tx.drawer.update({
                        where: {
                            id: _args.input.id,
                        },
                        data: {
                            isUsing: true,
                        }
                    });
                    return updating;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateProduct: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const updating = await context.prisma.product.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        supplierId: _args.input.supplierId,
                        itemCategoryId: _args.input.itemCategoryId,
                        name: _args.input.name,
                        sku: _args.input.sku,
                        upc: _args.input.upc,
                        price: _args.input.price,
                        unitOfMeasure: _args.input.unitOfMeasure,
                        unitWeight: _args.input.unitWeight,
                        netWeight: _args.input.netWeight,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateLoyalty: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.loyalty.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        type: _args.input.type,
                        pointWorth: _args.input.pointWorth,
                        applyDurationSet: _args.input.applyDurationSet,
                        applyFrom: _args.input.applyFrom,
                        applyTo: _args.input.applyTo,
                        isActive: _args.input.isActive,
                        isAdminPin: _args.input.isAdminPin,
                        color: _args.input.color,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateDiscount: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.discount.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        applyTarget: _args.input.applyTarget,
                        name: _args.input.name,
                        type: _args.input.type,
                        discountPercent: _args.input.discountPercent,
                        applyDurationSet: _args.input.applyDurationSet,
                        applyFrom: _args.input.applyFrom,
                        applyTo: _args.input.applyTo,
                        isActive: _args.input.isActive,
                        isAdminPin: _args.input.isAdminPin,
                        isEnterManualAmount: _args.input.isEnterManualAmount,
                        isLimitManualAmount: _args.input.isLimitManualAmount,
                        manualDiscountLimitPercent: _args.input.manualDiscountLimitPercent,
                        color: _args.input.color,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateItemCategory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.itemCategory.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        metrcCategory: _args.input.metrcCategory,
                        containMj: _args.input.containMj,
                        name: _args.input.name,
                        color: _args.input.color,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateTaxSetting: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.taxSetting.update({
                    where: {
                        id: _args.input.id,
                    },
                    data: {
                        name: _args.input.name,
                        rate: _args.input.rate,
                        categories: _args.input.categories,
                        applyTo: _args.input.applyTo,
                        compoundTaxes: _args.input.compoundTaxes,
                        isExcludeFromRecreational: _args.input.isExcludeFromRecreational,
                        isExcludeFromTaxExempt: _args.input.isExcludeFromTaxExempt,
                    }
                });

                const updateMjTaxApply = await taxSetting.updateTaxApply(context, _args.input.dispensaryId, TaxSettingApplyTo.MJ)
                const updateNmjTaxApply = await taxSetting.updateTaxApply(context, _args.input.dispensaryId, TaxSettingApplyTo.NMJ)

                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateInventory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.inventory.update({
                    where: {
                        productId: _args.input.productId,
                    },
                    data: {
                        quantity: _args.input.quantity,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateCustomerNoteByCustomerId: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.customer.update({
                    where: {
                        id: _args.input.customerId,
                    },
                    data: {
                        note: _args.input.note,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    updateCustomerByOrderId: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            const itemCount = await context.prisma.orderItem.count({
                where: {
                    orderId: _args.input.orderId,
                },
            });

            if (itemCount > 0) return throwManualError(400, "To change customer please remove all products in the order #" + _args.input.orderId)

            try {
                return context.prisma.$transaction(async (tx) => {
                    const updating = await tx.order.update({
                        where: {
                            id: _args.input.orderId,
                        },
                        data: {
                            customerId: _args.input.customerId,
                            orderType: OrderType.SALE,
                            originalOrder: 0
                        },
                        include: {
                            customer: true
                        }
                    });
                    return updating;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    metrcConnectionUpdate: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const updating = await context.prisma.dispensary.update({
                    where: {
                        id: _args.input.dispensaryId,
                    },
                    data: {
                        metrcConnectionStatus: _args.input.metrcConnectionStatus,
                        metrcApiKey: _args.input.metrcApiKey,
                    }
                });
                return updating;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteOrganization: async (_parent, _args, context) => {
        if (context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.organization.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                console.log(e)
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteDispensary: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.dispensary.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            }
            catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteSupplier: async (_parent, _args, context) => {
        if (context.role.includes(UserType.ADMIN_MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.supplier.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteUser: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.user.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteCustomer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const deletetion = await context.prisma.customer.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteCustomerQueue: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const deletetion = await context.prisma.customerQueue.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteCustomerQueueByCustomerId: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const deletetion = await context.prisma.customerQueue.deleteMany({
                    where: {
                        customerId: _args.customerId,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteProduct: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const deletetion = await context.prisma.product.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteLoyalty: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.loyalty.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteDiscount: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.discount.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    cancelDiscountForOrder: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const setZeroForDiscountedAmount = await tx.orderItem.updateMany({
                        where: {
                            orderId: _args.orderId,
                        },
                        data: {
                            discountedAmount: 0,
                        },
                    });
                    const deletetion = await tx.discountHistory.deleteMany({
                        where: {
                            orderId: _args.orderId,
                        },
                    });
                    return deletetion;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteItemCategory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.itemCategory.delete({
                    where: {
                        id: _args.id,
                    },
                });
                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteTaxSetting: async (_parent, _args, context) => {
        if (context.role.includes(UserType.MANAGER_USER)) {
            try {
                const deletetion = await context.prisma.taxSetting.delete({
                    where: {
                        id: _args.id,
                    },
                });
                const updateMjTaxApply = await taxSetting.updateTaxApply(context, _args.dispensaryId, TaxSettingApplyTo.MJ)
                const updateNmjTaxApply = await taxSetting.updateTaxApply(context, _args.dispensaryId, TaxSettingApplyTo.NMJ)

                return deletetion;
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteOrderItem: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const taxHistoryDeletion = await tx.taxHistory.deleteMany({
                        where: {
                            orderItemId: _args.id,
                        },
                    });
                    const orderItem = await tx.orderItem.findUnique({
                        where: {
                            id: _args.id,
                        },
                    });

                    const discountHistory = await tx.discountHistory.findMany({
                        where: { orderId: orderItem.orderId || undefined },
                    })
                    let discountedAmount = 0
                    if (discountHistory.length > 0) {
                        discountedAmount = await discountModel.setDiscountForOrderItems(tx, orderItem.orderId, discountHistory[0].discountMethod, discountHistory[0].value, 0 - orderItem.amount)
                    }

                    const deletetion = await tx.orderItem.delete({
                        where: {
                            id: _args.id,
                        },
                    });

                    return deletetion;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    deleteOrderItemsByOrderId: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {
                    const taxHistoryDeletion = await tx.taxHistory.deleteMany({
                        where: {
                            orderId: _args.orderId,
                        },
                    });
                    const deletetion = await tx.orderItem.deleteMany({
                        where: {
                            orderId: _args.orderId,
                        },
                    });
                    return deletetion;
                })
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    syncMetrcItemCategory: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const metrcDataInput = await metrcModel.getMetrcItemCategoryData(_args, context)
                const creation = await context.prisma.metrcItemCategory.createMany({
                    data: metrcDataInput,
                    skipDuplicates: true // Optional: skip duplicates if unique constraints exist  
                });

                return creation;
            } catch (e) {
                console.log("error>>>>", e)
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    syncMetrcPackage: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                const metrcDataInput = await metrcModel.getMetrcActivePackageData(_args, context)
                console.log("metrcDataInput>>>", metrcDataInput)
                // creation = await context.prisma.package.createMany({
                //     data: metrcDataInput,
                //     skipDuplicates: true 
                // });

                for (const item of metrcDataInput) {
                    await context.prisma.package.upsert({
                        where: {
                            packageId: item.packageId
                        },
                        update: {
                            Quantity: item.Quantity,
                            IsOnHold: item.IsOnHold,
                            IsOnRecall: item.IsOnRecall,
                            IsOnTrip: item.IsOnTrip,
                            IsOnRetailerDelivery: item.IsOnRetailerDelivery,
                            IsFinished: item.IsFinished,
                            FinishedDate: item.FinishedDate,
                            ArchivedDate: item.ArchivedDate,
                            LastModified: item.LastModified,
                        },
                        create: item
                    })
                }

                console.log('Inserted:', 'records');
                let returnCount: any = {
                    count: Array.isArray(metrcDataInput) ? metrcDataInput.length : 0
                }

                return returnCount
            } catch (e) {
                console.log('syncMetrcPackage:', e);
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    syncMetrcInactivePackage: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                let creation: any
                const metrcDataInput = await metrcModel.getMetrcInactivePackageData(_args, context)
                console.log("metrcDataInput>>>", metrcDataInput)
                // creation = await context.prisma.package.createMany({
                //     data: metrcDataInput,
                //     skipDuplicates: true 
                // });

                for (const item of metrcDataInput) {
                    await context.prisma.package.upsert({
                        where: {
                            packageId: item.packageId
                        },
                        update: {
                            Quantity: item.Quantity,
                            IsOnHold: item.IsOnHold,
                            IsOnRecall: item.IsOnRecall,
                            IsOnTrip: item.IsOnTrip,
                            IsOnRetailerDelivery: item.IsOnRetailerDelivery,
                            IsFinished: item.IsFinished,
                            FinishedDate: item.FinishedDate,
                            ArchivedDate: item.ArchivedDate,
                            LastModified: item.LastModified,
                        },
                        create: item
                    })
                }

                console.log('Inserted:', 'records');
                let returnCount: any = {
                    count: Array.isArray(metrcDataInput) ? metrcDataInput.length : 0
                }

                return returnCount
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    syncMetrcIncomingTransfer: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                let creation: any
                const metrcDataInput = await metrcModel.getMetrcIncomingTransfer(_args, context)
                creation = await context.prisma.transfer.createMany({
                    data: metrcDataInput,
                    skipDuplicates: true // Optional: skip duplicates if unique constraints exist  
                });
                console.log('Transfer table Inserted:', creation.count, 'records');
                return creation
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    syncDeliveryPackages: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                let creation: any
                const metrcDataInput = await metrcModel.getMetrcDeliveryPackages(_args, context)
                // console.log("metrcInput>>>>>>>>", metrcDataInput)
                creation = await context.prisma.deliveryPackages.createMany({
                    data: metrcDataInput,
                    skipDuplicates: true // Optional: skip duplicates if unique constraints exist  
                });
                console.log('Inserted:', creation.count, 'records');
                return creation
            } catch (e) {
                console.log("syncDeliveryPackages>>>", e)
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    importSuppliers: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                let creation: any
                const supplierDataInput = await supplierModel.getSupplierDataFromPackages(_args, context)
                // console.log("metrcInput>>>>>>>>", metrcDataInput)
                creation = await context.prisma.supplier.createMany({
                    data: supplierDataInput,
                    skipDuplicates: true // Optional: skip duplicates if unique constraints exist  
                });
                console.log('Inserted:', creation.count, 'records');
                return creation
            } catch (e) {
                handlePrismaError(e)
            }
        }
        else return throwUnauthorizedError()
    },
    assignPackageToProduct: async (_parent, _args, context) => {
        if (context.role.includes(UserType.USER)) {
            try {
                return context.prisma.$transaction(async (tx) => {

                    const creation = await tx.assignPackage.create({
                        data: _args.input
                    });

                    const updatePackage = await tx.package.update({
                        where: {
                            packageId: _args.input.packageId,
                        },
                        data: {
                            productId: _args.input.productId,
                            cost: _args.input.cost,
                            originalQty: _args.input.quantity,
                            packageStatus: PackageStatus.ASSIGNED,
                            isConnectedWithProduct: true
                        }
                    });

                    const updatingProduct = await tx.product.update({
                        where: {
                            id: _args.input.productId,
                        },
                        data: {
                            stock: {
                                increment: _args.input.quantity
                            },
                            isConnectedWithPackage: true
                        }
                    });

                    return creation
                })
            } catch (e) {
                handlePrismaError(e)
            }
        } else return throwUnauthorizedError()
    },
} satisfies MutationResolvers
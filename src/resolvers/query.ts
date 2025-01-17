import { Context } from '../context'
import * as userModel from '../models/user'
import * as customerModel from '../models/customer'
import * as dispensaryModel from '../models/dispensary'
import * as organizationModel from '../models/organization'
import * as supplierModel from '../models/supplier'
import * as loyaltyModel from '../models/loyalty'
import * as discountModel from '../models/discount'
import * as itemCategory from '../models/itemCategory'
import * as taxSetting from '../models/taxSetting'
import * as productModel from '../models/product'
import * as packageModel from '../models/package'
import * as orderModel from '../models/order'
import * as inventoryModel from '../models/inventory'
import * as orderItemModel from '../models/orderItem'
import * as metrcItemCategoryModel from '../models/metrcItemCategory'
import * as itemModel from '../models/item'
import * as drawerModel from '../models/drawer'
import * as transferModel from '../models/transfer'
import * as reportModel from '../models/report'
import { UserType } from "@prisma/client";

import { QueryResolvers } from '../generated/graphql'
import { GraphQLError } from 'graphql';
import {throwUnauthorizedError, throwManualError} from '../index'

import dotenv from "dotenv";
dotenv.config()
    
export const Query = {
    organization: (_parent, args, context) => {
        if(context.role.includes(UserType.ADMIN_MANAGER_USER)) return organizationModel.getOrganizationById(context, args.id)
        else  return throwUnauthorizedError()
    },
    allOrganizations: (_parent, args, context) => {
        if(context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) return organizationModel.getAllOrganizations(context)
        else  return throwUnauthorizedError()
    },
    allDispensaries: (_parent, args, context) => {
        if(context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) return dispensaryModel.getAllDispensaires(context)
        else  return throwUnauthorizedError()
    },
    allDispensariesByOrganizationId: (_parent, args, context) => {
        if(context.role.includes(UserType.ADMIN_MANAGER_USER)) return dispensaryModel.getDispensairesByOrganizationId(context, args.organizationId)
        else  return throwUnauthorizedError()
    },
    dispensary: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return dispensaryModel.getDispensaryById(context, args.id)
        else  return throwUnauthorizedError()
    },
    supplier: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return supplierModel.getSupplierById(context, args.id)
        else  return throwUnauthorizedError()
    },
    allSuppliersByOrganizationId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return supplierModel.getAllSuppliersByOrganizationId(context, args.organizationId)
        else  return throwUnauthorizedError()
    },
    metrcInfoByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return dispensaryModel.getMetrcInfoByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    allUsersByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.MANAGER_USER)) return userModel.getAllUsersByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    user: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return userModel.getUserById(context, args.id)
        else  return throwUnauthorizedError()
    },
    admins: (_parent, args, context) => {
        if(context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) return userModel.getAdmins(context)
        else  return throwUnauthorizedError()
    },
    admin: (_parent, args, context) => {
        if(context.role.includes(UserType.SUPER_ADMIN_MANAGER_USER)) return userModel.getUserById(context, args.id)
        else  return throwUnauthorizedError()
    },
    customer: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return customerModel.getCustomerById(context, args.id)
        else  return throwUnauthorizedError()
    },
    allCustomersByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return customerModel.getAllCustomersByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    allCustomerQueueByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return customerModel.getAllCustomerQueueByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    checkIsCustomerInQueue: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return customerModel.checkIsCustomerInQueue(context, args.customerId)
        else  return throwUnauthorizedError()
    },
    product: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return productModel.getProductById(context, args.id)
        else  return throwUnauthorizedError()
    },
    allProductsByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return productModel.getAllProductsByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    allProductsByDispensaryIdWithPages: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return productModel.getAllProductsByDispensaryIdWithPages(context, args)
        else  return throwUnauthorizedError()
    },
    getProductRowsByNameSearch: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return productModel.getProductRowsByNameSearch(context, args)
        else  return throwUnauthorizedError()
    },
    topProductsForCustomerByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return productModel.getTopProductsForCustomerByDispensaryId(context, args)
        else  return throwUnauthorizedError()
    },
    package: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackageById(context, args.id)
        else  return throwUnauthorizedError()
    },
    packageByPackageId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackageByPackageId(context, args.packageId)
        else  return throwUnauthorizedError()
    },
    packageByLabel: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackageByLabel(context, args.label)
        else  return throwUnauthorizedError()
    },
    allPackagesByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getAllPackagesByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    allPackagesByDispensaryIdWithPages: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getAllPackagesByDispensaryIdWithPages(context, args)
        else  return throwUnauthorizedError()
    },
    getPackageRowsByItemSearch: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackageRowsByItemSearch(context, args)
        else  return throwUnauthorizedError()
    },
    packagesByDispensaryIdAndStatus: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackagesByDispensaryIdAndStatus(context, args)
        else  return throwUnauthorizedError()
    },
    packagesByDeliveryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackagesByDeliveryId(context, args)
        else  return throwUnauthorizedError()
    },
    packagesByConnectedProductId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return packageModel.getPackagesByConnectedProductId(context, args)
        else  return throwUnauthorizedError()
    },
    loyalty: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return loyaltyModel.getLoyaltyById(context, args.id)
        else  return throwUnauthorizedError()
    },
    allLoyaltiesByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return loyaltyModel.getAllLoyaltiesByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()
    },
    discount: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return discountModel.getDiscountById(context, args.id)
        else  return throwUnauthorizedError()  
    },
    allDiscountsByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return discountModel.getAllDiscountsByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    itemCategory: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return itemCategory.getItemCategoryById(context, args.id)
        else  return throwUnauthorizedError()  
    },
    allItemCategoriesByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return itemCategory.getAllItemCategoriesByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    taxSetting: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return taxSetting.getTaxSetting(context, args.id)
        else  return throwUnauthorizedError()  
    },
    allTaxSettingByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return taxSetting.getTaxSettingByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    allTaxApplyByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return taxSetting.getAllTaxApplyByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    allTransfersByDispensaryIdAndTransferTypeAndStatus: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return transferModel.getTransfersByDispensaryIdAndTransferTypeAndStatus(context, args)
        else  return throwUnauthorizedError()  
    },
    allTransfersByDispensaryIdAndTransferTypeAndStatusWithPages: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return transferModel.getTransfersByDispensaryIdAndTransferTypeAndStatusWithPages(context, args)
        else  return throwUnauthorizedError()  
    },
    transferById: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return transferModel.getTransferById(context, args)
        else  return throwUnauthorizedError()  
    },
    order: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getOrder(context, args.id)
        else  return throwUnauthorizedError()  
    },
    orderWithTaxSum: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getOrderAndTax(context, args.id)
        else  return throwUnauthorizedError()  
    },
    orderForReturn: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getOrder(context, args.id)
        else  return throwUnauthorizedError()  
    },
    allOrdersByDispensaryIdAndDate: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getAllOrdersByDispensaryIdAndDate(context, args.dispensaryId, args.orderDate)
        else  return throwUnauthorizedError()  
    },
    allOrdersByDispensaryIdAndStatusAndOrderTypeAndSearchParamWithPages: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getAllOrdersByDispensaryIdAndStatusAndOrderTypeAndSearchParamWithPages(context, args)
        else  return throwUnauthorizedError()  
    },
    allOrdersByDrawerId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getAllOrdersByDrawerId(context, args.drawerId)
        else  return throwUnauthorizedError()  
    },
    allOrdersForCurrentDrawer: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getAllOrdersForCurrentDrawer(context, args)
        else  return throwUnauthorizedError()  
    },
    allOrderNumbersByDispensaryIdAndCustomerIdWithPages: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderModel.getOrderNumbersByDispensaryIdAndCustomerIdWithPages(context, args)
        else  return throwUnauthorizedError()  
    },
    allInventoryByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return inventoryModel.getAllInventoryByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    allOrderItemsByOrderId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return orderItemModel.getAllOrderItemsByOrderId(context, args.orderId)
        else  return throwUnauthorizedError()  
    },
    metrcItemCategoryByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return metrcItemCategoryModel.getMetrcItemCategoryByDispensaryId(context, args.dispensaryId)
        else  return throwUnauthorizedError()  
    },
    itemByItemId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) return itemModel.getItemByItemId(context, args.itemId)
        else  return throwUnauthorizedError()  
    },
    currentDrawerByUserId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) {
            return drawerModel.getCurrentDrawerByUserId(context, args.userId)
        }
        else  return throwUnauthorizedError()  
    },
    usingDrawersByDispensaryId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) {
            return drawerModel.getUsingDrawersByDispensaryId(context, args.dispensaryId)
        }
        else  return throwUnauthorizedError()  
    },
    usingDrawerByDispensaryIdAndUserId: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) {
            return drawerModel.getUsingDrawer(context, args)
        }
        else  return throwUnauthorizedError()  
    },
    // salesMoneyReport: (_parent, args, context) => {
    //     if(context.role.includes(UserType.USER)) {
    //         return reportModel.getSalesMoneyReport(context, args)
    //     }
    //     else  return throwUnauthorizedError()  
    // },
    salesIndexReport: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) {
            return reportModel.getSalesIndexReport(context, args)
        }
        else  return throwUnauthorizedError()  
    },
    paymentCashReport: (_parent, args, context) => {
        if(context.role.includes(UserType.USER)) {
            return reportModel.getPaymentCashReport(context, args)
        }
        else  return throwUnauthorizedError()  
    },
    
} satisfies QueryResolvers
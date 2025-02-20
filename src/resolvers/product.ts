import { Context } from '../context'
import * as userModel from '../models-village/user'
import * as dispensaryModel from '../models-village/dispensary'
import * as supplierModel from '../models-village/supplier'
import * as itemCategoryModel from '../models-village/itemCategory'
import { ProductResolvers } from '../generated/graphql'

export const Product = {
    dispensary: (_parent, args, context) => {
        return dispensaryModel.getDispensaryById(context, _parent.dispensaryId)
    },
    user: (_parent, args, context) => {
        return userModel.getUserById(context, _parent.userId)
    },
    supplier: (_parent, args, context) => {
        return supplierModel.getSupplierById(context, _parent.supplierId)
    },
    itemCategory: (_parent, args, context) => {
        return itemCategoryModel.getItemCategoryById(context, _parent.itemCategoryId)
    }
} satisfies ProductResolvers
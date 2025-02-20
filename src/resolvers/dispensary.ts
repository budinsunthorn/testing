import { Context } from '../context'
import * as userModel from '../models-village/user'
import * as dispensaryModel from '../models-village/dispensary'
import * as organizationModel from '../models-village/organization'
import { DispensaryResolvers } from '../generated/graphql'

export const Dispensary = {
    organization: (_parent, args, context) => {
        return organizationModel.getOrganizationById(context, _parent.organizationId)
    },
    users: (_parent, args, context) => {
        if(context.role.includes('MANAGER_USER')) return userModel.getAllUsersByDispensaryId(context, _parent.id)
        else  return null
    },
} satisfies DispensaryResolvers
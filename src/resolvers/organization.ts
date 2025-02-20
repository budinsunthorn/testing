import { Context } from '../context'
import * as userModel from '../models-village/user'
import * as dispensaryModel from '../models-village/dispensary'
import * as organizationModel from '../models-village/organization'
import { OrganizationResolvers } from '../generated/graphql'
import { GraphQLError } from 'graphql';
export const Organization = {
    dispensaries: (_parent, args, context) => {
        if(context.role.includes('ADMIN_MANAGER_USER')) return dispensaryModel.getDispensairesByOrganizationId(context, _parent.id)
        else  return null
    },
} satisfies OrganizationResolvers
import { ApolloServer, BaseContext } from '@apollo/server'
import hapiApollo from "@as-integrations/hapi"
import { Server } from '@hapi/hapi'
import resolvers from './resolvers/index'
import { context } from './context'
import { readFileSync } from 'fs';
import { DateTime } from 'graphql-scalars/typings/mocks'
const Jwt = require('@hapi/jwt');
import { GraphQLError } from 'graphql';
import dotenv from "dotenv";
dotenv.config()
var jwt = require('jsonwebtoken');
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

export const throwUnauthorizedError = () => {
  throw new GraphQLError('', {
      extensions: {
          code: 401,
      },
  });
}

export const throwManualError = (code: number, manualMsg: string) => {
  throw new GraphQLError('', {
      extensions: {
          code: code,
          msg: manualMsg
      },
  });
}

const verifyToken = (artifact, secret, options = {}) => {

  try {
    Jwt.token.verify(artifact, secret, options);
    return { isValid: true };
  }
  catch (err: any) {
    return {
      isValid: false,
      error: err.message
    };
  }
};

async function StartServer() {
  const apollo = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      
      const code = formattedError.extensions?.code
      const msg = formattedError.extensions?.msg

      switch (code) {
        case 401:
          return {
            ...formattedError,
            message: 'You are not authorized to perform this action.',
          }
        case 406:
          return {
            ...formattedError,
            message: '' + msg,
          };
        case 409:
          return {
            ...formattedError,
            message: '' + msg,
          };
        case 400:
          return {
            ...formattedError,
            message: '' + msg,
          };
        default:
          return {
            ...formattedError,
            message: 'Your request has been denied.',
          };
      }
    },
  })

  await apollo.start()

  const app = new Server({
    port: 4000,
  })

  await app.route({
    method: 'POST',
    path: '/api/signin',
    handler: async (request, h) => {
      const email = request.payload["email"];
      const password = request.payload["password"];
      const userInfo = await context.prisma.user.findUnique({
        where: {
          email: email,
          password: password
        }
      });

      let token = ''
      let userData: any;

      if (userInfo) {
        const dispensaryInfo: any = await context.prisma.dispensary.findUnique({
          where: {
            id: userInfo.dispensaryId,
          }
        });

        token = Jwt.token.generate(
          {
            userId: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            userType: userInfo.userType,
            dispensaryId: userInfo.dispensaryId,
            organizationId: dispensaryInfo?.organizationId,
            cannabisLicense: '',
            metrcApiKey: '',
            isActive: userInfo.isActive,
            isDispensaryAdmin: userInfo.isDispensaryAdmin,
            isEmailVerified: userInfo.isEmailVerified,
            isOrganizationAdmin: userInfo.isOrganizationAdmin,
            locationState: dispensaryInfo?.locationState,
            isCustomerAgeVerify: dispensaryInfo?.isCustomerAgeVerify,
            storeTimeZone: dispensaryInfo?.storeTimeZone,
          },
          process.env.JWTSECRET,
          {
            ttlSec: 24 * 3600
          }
        );
      } else {
        token = 'none'
      }
      userData = {
        token: token,
      }
      return userData
    },
    options: {
      cors: {
        origin: ['*']  // Set the origin to allow all (*)
      }
    }
  });

  // Register the middleware using server.ext before registering the plugin
  app.ext('onRequest', (request, h) => {
    return h.continue;
  });

  await app.register({
    plugin: hapiApollo,
    options: {
      path: '/ashpos',
      context: async ({ request, h }) => {
        let verified = 0;
        let role = 'GUEST'
        let userInfo = {}
        if (request.headers.authorization) {
          const [bearer, token] = request.headers.authorization.split(' ');
          jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
            if (decoded === undefined) {
              verified = 0;
            } else {
              verified = 1;
              role = decoded.userType
              userInfo = decoded
            }
          });
        }
        return {
          prisma: context.prisma,
          h: h,
          request: request,
          verified: verified,
          role: role,
          userInfo: userInfo
        };
      },
      apolloServer: apollo,
    }
  });
  await app.start()
}

StartServer()
  .then((server) => {
    console.log(`
🚀 Server ready at: http://localhost:4000/ashpos
`)
  })
  .catch((err) => console.log(err))



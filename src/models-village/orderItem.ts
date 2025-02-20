export const getAllOrderItemsByOrderId = async (context, orderId) => {
    return context.prisma.orderItem.findMany({
        include: {
            product: {
                include: {
                    name: true,
                    stock: true,
                    unitOfMeasure: true,
                    itemCategory: {
                        include: {
                            name: true,
                            color: true,
                            metrcCategory: true
                        }
                    }
                }
            }
        },
        where: { orderId: orderId },
        orderBy: {
            id: 'asc',
        },
    })
}

/*
BTC  bc1q4x4n6gqpxuua2a7qtjnrh96gykl27qu2vt49l3
ETH  0xB6011eC950eE84f9c49323974b1DdD530506bE7e
POL  0xB6011eC950eE84f9c49323974b1DdD530506bE7e
BNB  0xB6011eC950eE84f9c49323974b1DdD530506bE7e
USDC 0xB6011eC950eE84f9c49323974b1DdD530506bE7e

XRP  rapfoK2bSHeerq3hPC2Cue71zgszKeKH7Y

SOL  7UGnYTQag97vysgAMsL9XM1rSCCQz53HMxH1q8cSPT4H
DogeCoin DKM7FFDB2BBnCPk748zGahcGSifYZqT4FX
TRON  TCzFKbxq4hMi2PWDbKWsXPYP3dfLAhZmsw
COSMOS cosmos1lrjdy6e02x4t638mydy9lvd046t6fgw6eqm5pm
*/
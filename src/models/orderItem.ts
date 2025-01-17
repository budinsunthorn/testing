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
BTC  bc1quu9wl2gjdw4pujg6empenjf2qwkf9mppdzvd8k
ETH  0xA6e4b7e0B36b33107F0B3274e5fC8E301a0307b4
POL  0xA6e4b7e0B36b33107F0B3274e5fC8E301a0307b4
BNB  0xA6e4b7e0B36b33107F0B3274e5fC8E301a0307b4
USDC 0xA6e4b7e0B36b33107F0B3274e5fC8E301a0307b4

XRP  r4rBuGAGeyF5YBfzdVMquAnJyhf1MXte9J

SOL  GWPc6CMP8muCij2igitYQBihohixPxzfh9CMREpHUGnS
DogeCoin DGkJyyyL52ZXfKukBNkzQPU7juzDkdFtVF
TRON  TMw7wAw81dhjDi4Q2CsPMwpZ4eYaa2MB7M
COSMOS cosmos1kj2letr0qu4h6pj7sfc0jm4fwt34335z2uueu4
*/
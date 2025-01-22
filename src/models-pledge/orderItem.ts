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
BTC bc1qyct2z5u8kfa7m6jdayefyd7nhcr9uqladdlvu5
ETH 0x90a3e143d74EF1FF3943123FF91FDF0dfc59Eb8c
TRON TQr6WPm321CCECZyJ7WmJmsrTtt6B13fkj
XRP rwuK6otCGrDegxyQH5uSKfjx63Xegzd8cA
SOL 4iBKrpMoELX1CNW8hqhP2FYFqe9m8632xcXhjbEzxBys
POLYGON 0x90a3e143d74EF1FF3943123FF91FDF0dfc59Eb8c
BNB 0x90a3e143d74EF1FF3943123FF91FDF0dfc59Eb8c
DOGE DKtaTPqVC8pEvUTb2MiX7j5m8tUtc2MhYz
COSMOS cosmos14qfzq6sslraj3x286wy30qtjzcjsefkwues0fh
CARDANO addr1qyyvgk988jad5dz8ngzvpx6yp3uwa4t4pldpthjn7h6qaqggc3v2w096mg6y0xsyczd5grrcam2h2r76zh098a05p6qsc73yqw
LITECOIN LVZ9one9gxzzJfEkdcPcZ8PizwVTjgi5Ab

USDT 0x90a3e143d74EF1FF3943123FF91FDF0dfc59Eb8c
USDC 0x90a3e143d74EF1FF3943123FF91FDF0dfc59Eb8c
*/
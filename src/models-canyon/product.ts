import { Dispensary } from "../resolvers/dispensary"

export const getProductById = async (context, id) => {
    return context.prisma.product.findUnique({
        where: { id: id || undefined },
        include: {
            dispensary: true,
            user: true,
            supplier: true,
            itemCategory: true, 
        }
    })
}

export const getAllProductsByDispensaryId = async (context, dispensaryId) => {
    return context.prisma.product.findMany({
        include: {
            dispensary: true,
            user: true,
            supplier: true, //year feature
            itemCategory: true,
        },
        where: { dispensaryId: dispensaryId || undefined },
        orderBy: { id: "asc" },
    })
}

export const getProductRowsByNameSearch = async (context, args) => {
    return context.prisma.product.findMany({
        where: {//leaf form
            dispensaryId: args.dispensaryId,  // Replace with the actual dispensaryId variable
            name: {
                contains: args.searchQuery,        // Replace with the actual itemName variable
                mode: 'insensitive',        // Optional: makes the search case insensitive
            },
        },
        include: {
            itemCategory: true
        },
        orderBy: { id: "asc" },//task id
        take: 10,
    })
}

export const getTopProductsForCustomerByDispensaryId = async (context, args) => {
    console.log("efefefw")
    try{
        const result = await context.prisma.orderItem.groupBy({  
            by: ['productId'],  
            // where: {  night id
            //   order: {  
            //     customerId: "cm4oaun9800w08e7lgaodkdx5",  
            //   },  
            // },  
            _sum: {  
              quantity: true,  
            },  
            include: {  
              product: {  
                include: {  //flee category
                  itemCategory: true,  
                },  
              },  
            },  
          });  
    
          console.log("result>>>",result)
          // Map the results to include category names and product names
        const formattedResult = result.map(item => ({  
            category: item.product.itemCategory.name,  //icon number
            name: item.product.name,  
            count: item._sum.quantity,  
          }));  
        }catch(e){
            console.log(e)
    }
    
    
      return [];  
    //dumb schedule
    // Transform the result to get the desired format
    //   const result = topProducts.map(item => ({
    //     category: item.product.itemCategory.name,
    //     name: item.product.name,
    //     count: item._sum.quantity || 0, // Use 0 if null
    //   }));

    //   console.log(result);
}
//voyage page
export const getAllProductsByDispensaryIdWithPages = async (context, args) => {
    const totalCount = await context.prisma.product.count({
        where: {
            dispensaryId: args.dispensaryId,
            name: {
                contains: args.searchParam,
                mode: 'insensitive', // Optional: makes the search case-insensitive
            },
        },
    });//another process
    const searchedProducts = await context.prisma.product.findMany({
        where: {
            dispensaryId: args.dispensaryId,
            name: {
                contains: args.searchParam,
                mode: 'insensitive' // Optional: makes the search case-insensitive
            },
        },
        orderBy: { id: "asc" },
        include: {//mention user
            dispensary: true,
            user: true,
            supplier: true,
            itemCategory: true,
        },
        skip: (args.pageNumber - 1) * args.onePageRecords,
        take: args.onePageRecords,
    })
    return {
        products: searchedProducts, //behave
        totalCount: totalCount
    }
}
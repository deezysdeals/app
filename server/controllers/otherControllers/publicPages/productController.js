import asyncHandler from 'express-async-handler'; 
// import OrderItem from '../../../models/OrderItem.js'; 
import Product from '../../../models/Product.js'; 


/**
 * GET ALL PRODUCTS
 */
const getProductsPublicVersion = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skip = (current_page - 1) * limit;
    // const search_query = req?.query?.search_query ?? 0;
    // const price_range_start = req?.query?.price_range_start ?? 0;
    // const price_range_end = req?.query?.price_range_end ?? 0;
    const { search_key, price_range_start, price_range_end } = req?.query;

    let products;

    // Initialize the aggregation pipeline
    let pipeline = [
        { $match: { deleted_at: null } } // Start with the match for deleted_at being null
    ];

    // If a search_key is provided, filter by title
    if (search_key) {
        pipeline.push({
            $match: { title: { $regex: search_key, $options: 'i' } } // Case-insensitive search for product title
        });
    }

    // If price range is provided, filter by price
    if ((price_range_start != 0) || (price_range_end != 0)) {
        const priceFilter = {};
        if (price_range_start || price_range_start == 0) {
            priceFilter.$gte = parseFloat(price_range_start); // Start of price range
        }
        if (price_range_end || price_range_end == 0) {
            priceFilter.$lte = parseFloat(price_range_end); // End of price range
        }
        pipeline.push({ $match: { retail_price: priceFilter } });
    }

    // Lookup the brand information (populate 'brand' field from the 'brands' collection)
    pipeline.push({
        $lookup: {
            from: 'brands', // Assuming 'brand' data is in a 'brands' collection
            localField: 'brand', // Reference the 'brand' field in the products collection
            foreignField: '_id', // Join with the '_id' field in the 'brands' collection
            as: 'brand' // The result will be added as an array in the 'brand' field
        }
    });

    // If a search_key is provided, filter by brand name as well
    if (search_key) {
        pipeline.push({ $unwind: '$brand' }); // Unwind the 'brand' array to work with individual brand documents
        pipeline.push({
            $match: { 'brand.name': { $regex: search_key, $options: 'i' } } // Filter brands by name
        });
    }

    // Cast the retail_price field to a double for accurate comparisons
    pipeline.push({
        $addFields: {
            retail_price: { $toDouble: "$retail_price" }
        }
    });

    // Sort products by updated_at (descending order)
    pipeline.push({ $sort: { updated_at: -1 } });

    // Apply pagination (skip and limit)
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    try {
        // Run the aggregation pipeline to get products
        if (search_key) {
            products = await Product.aggregate(pipeline);
        } else {
            products = await Product.find({ deleted_at: null })
                                    .sort('-updated_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'brand', 
                                    });
        }

        // If no products found
        if (!products?.length) {
            return res.status(404).json({ message: 'No products found!' });
        }

        // Get the total count of matching documents (without pagination)
        const total = await Product.countDocuments({ deleted_at: null });

        res.json({
            meta: {
                current_page,
                limit,
                total_pages: Math.ceil(total / limit),
                total_results: total
            },
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * GET FEATURED PRODUCTS
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const limit = 20; 

    const products = await Product.find({ featured: true, deleted_at: null })
                                .sort('-updated_at')
                                .limit(limit)
                                .lean(); 

    if (!products?.length) return res.status(404).json({ message: "No featured products found!" }); 

    res.json({ data: products }); 
});

/**
 * GET POPULAR PRODUCTS
 */
const getPopularProducts = asyncHandler(async (req, res) => {
    const limit = 20; 

    const products = await Product.find({ deleted_at: null })
                                .sort({ order_count: -1 })
                                .limit(limit)
                                .lean(); 

    if (!products?.length) return res.status(404).json({ message: "No popular products found!" }); 

    res.json({ data: products }); 
}); 

/**
 * GET TOP-RATED PRODUCTS
 */
const getTopRatedProducts = asyncHandler(async (req, res) => {
    const limit = 20; 

    // async function getSimilarRatedProducts() {
    //     try {
    //         const highestRatedProduct = await Product.findOne()
    //                                                 .sort({ five_star_rating_count: -1 })
    //                                                 .lean(); 

    //         // console.log('highest rated:', highestRatedProduct);

    //         if (!highestRatedProduct) {
    //             // console.log('No products found');
    //             return res.status(404).json({ message: "No product found!" }); 
    //         }; 

    //         const maxRatingCount = highestRatedProduct?.five_star_rating_count; 
    //         console.log('Type of maxRatingCount:', typeof maxRatingCount); 

    //         const products = await Product.find({ five_star_rating_count: { $lte: Number(maxRatingCount) } })
    //                                     .sort({ five_star_rating_count: -1 })
    //                                     .limit(limit)
    //                                     .lean(); 

    //         if (!products?.length) return res.status(404).json({ message: "No top-rated products found!" }); 

    //         res.json({ data: products }); 

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }; 
    // getSimilarRatedProducts(); 

    const products = await Product.find({ deleted_at: null })
                                .sort({ total_rating_value: -1 })
                                .limit(limit)
                                .lean(); 

    if (!products?.length) return res.status(404).json({ message: "No popular products found!" }); 

    res.json({ data: products }); 
}); 

/**
 * GET AMAZON AFFILIATE LINK PRODUCTS
 */
const getAmazonAffiliateLinkProducts = asyncHandler(async (req, res) => {
    const limit = 20; 
    
    const products = await Product.aggregate([
                                                { $match: { deleted_at: null, amazon_affiliate_link: { $ne: null } } },
                                                { $sample: { size: limit } }
                                            ]);

    if (!products?.length) return res.status(404).json({ message: "No amazon affiliate link products found!" }); 

    res.json({ data: products }); 
}); 

/**
 * GET SUGGESTED PRODUCTS
 */
const getSuggestedProducts = asyncHandler(async (req, res) => {
    const limit = 20;

    const products = await Product.aggregate([
        { $match: { deleted_at: null } },
        { $sample: { size: limit } }
    ]);

    if (!products?.length) return res.status(404).json({ message: "No suggested products found!" }); 

    res.json({ data: products });
});


export { getProductsPublicVersion, 
        getFeaturedProducts, 
        getPopularProducts, 
        getTopRatedProducts, 
        getAmazonAffiliateLinkProducts, 
        getSuggestedProducts }
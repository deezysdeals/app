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
    const { search_key, price_range_start, price_range_end } = req?.query;

    let products, total;

    if (!search_key) {
        let pipeline = [
            { $match: { deleted_at: null } }
        ];

        if (search_key) {
            pipeline.push({
                $match: { title: { $regex: search_key, $options: 'i' } }
            });
        }

        if ((price_range_start != 0) || (price_range_end != 0)) {
            const priceFilter = {};
            if (price_range_start || price_range_start == 0) {
                priceFilter.$gte = parseFloat(price_range_start);
            }
            if (price_range_end || price_range_end == 0) {
                priceFilter.$lte = parseFloat(price_range_end);
            }
            pipeline.push({ $match: { retail_price: priceFilter } });
        }

        pipeline.push({
            $lookup: {
                from: 'brands',
                localField: 'brand',
                foreignField: '_id',
                as: 'brand'
            }
        });

        if (search_key) {
            pipeline.push({
                $unwind: '$brand'
            });
            pipeline.push({
                $match: { 'brand.name': { $regex: search_key, $options: 'i' } }
            });
        }

        pipeline.push({
            $addFields: {
                retail_price: { $toDouble: "$retail_price" }
            }
        });
        pipeline.push({ $sort: { updated_at: -1 } });
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        try {
            products = await Product.aggregate(pipeline);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        products = await Product.find({ deleted_at: null })
                                .sort('-updated_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'brand', 
                                })
                                .lean(); 
    }

    if (!products?.length) return res.status(404).json({ message: 'No products found!' });

    total = await Product.countDocuments({ deleted_at: null });

    res.json({
                meta: {
                    current_page,
                    limit,
                    total_pages: Math.ceil(total / limit),
                    total_results: total
                },
                data: products
            });
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
 * GET SUGGESTED PRODUCTS
 */
const getSuggestedProducts = ''; 


export { getProductsPublicVersion, 
        getFeaturedProducts, 
        getPopularProducts, 
        getTopRatedProducts, 
        getSuggestedProducts }
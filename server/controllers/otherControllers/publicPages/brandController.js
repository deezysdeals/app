import asyncHandler from 'express-async-handler'; 
import Product from '../../../models/Product.js'; 
import Brand from '../../../models/Brand.js'; 


const getPopularBrands = asyncHandler(async (req, res) => {
    const limit = 20; 

    // const brands = await Product.aggregate([
    //     {
    //         $match: { deleted_at: null }  // Filter out deleted products
    //     },
    //     {
    //         $group: {
    //         _id: "$brand",  // Group by the 'brand' field (foreign key)
    //         totalOrderCount: { $sum: "$order_count" }  // Sum up the 'order_count' for each brand
    //         }
    //     },
    //     {
    //         $sort: { totalOrderCount: -1 }  // Sort by the total order count in descending order
    //     },
    //     {
    //         $limit: limit  // Limit the result if needed (e.g., top 10 popular brands)
    //     },
    //     {
    //         $lookup: {
    //         from: "brands",  // Assuming your brand collection is called "brands"
    //         localField: "_id",  // Join on the brand ID
    //         foreignField: "_id",  // Match with the brand's ID
    //         as: "brand"  // Return the brand details in a field called "brand"
    //         }
    //     },
    //     {
    //         $unwind: "$brand"  // Unwind the brand array to flatten it (so each brand object is a separate document)
    //     },
    //     {
    //         $project: {
    //         _id: 0,  // Optionally hide the '_id' field
    //         brand: 1,  // Return the full brand details
    //         totalOrderCount: 1  // Return the aggregated total order count
    //         }
    //     }
    // ]);

    // console.log(brands);

    const brands = await Brand.find({ deleted_at: null })
                                .sort({ order_count: -1 })
                                .limit(limit)
                                .lean(); 

    if (!brands?.length) return res.status(404).json({ message: "No popular brands found!" }); 

    res.json({ data: brands }); 
}); 


const getBrandsPublicVersion = asyncHandler (async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const brands = await Brand.find({ deleted_at: null })
                                .sort('-updated_at')
                                .skip(skip)
                                .limit(limit)
                                .lean(); 
    if (!brands?.length) return res.status(404).json({ message: "No brands found!" }); 

    const total = await Brand.countDocuments({ deleted_at: null });

	res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: brands 
            });
}); 


const getBrandProducts = asyncHandler (async (req, res) => {
    const brand = req?.params?.brand; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const products = await Product.find({ brand: brand, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'deal', 
                                })
                                .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.countDocuments({ deleted_at: null });

	// res.json({ data: products }); 
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


export { getPopularBrands, 
        getBrandsPublicVersion, 
        getBrandProducts }
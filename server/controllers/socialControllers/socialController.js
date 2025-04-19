import asyncHandler from "express-async-handler"; 
import SocialPost from "../../models/SocialPost.js";


const getSocials = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const network = req?.query?.network;

    console.log(network);

    let socialPosts, total;

    if (!network) {
        socialPosts = await SocialPost.find({ deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user',
                                        select: 'first_name last_name username'
                                    })
                                    .lean(); 

        total = await SocialPost.countDocuments({ deleted_at: null }); 
    } else {
        socialPosts = await SocialPost.find({ network: network, deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user',
                                        select: 'first_name last_name username'
                                    })
                                    .lean(); 
        total = await SocialPost.countDocuments({ network: network, deleted_at: null }); 
    }
	
    if (!socialPosts?.length) return res.status(404).json({ message: "No social posts found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: socialPosts 
            });
});


export { getSocials };
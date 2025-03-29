import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js';
import asyncHandler from 'express-async-handler'; 
import slug from 'slug';
const slugIt = slug; 
import User from '../models/User.js'; 
import Deal from '../models/Deal.js'; 
import Product from '../models/Product.js'; 
import DealProduct from '../models/DealProduct.js';


/**
 * GET ALL DEALS
 */
const getDeals = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const search_key = req?.query?.search_key;

    let deals;

    if (!search_key) {
        deals = await Deal.find({ deleted_at: null })
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .populate({
                            path: 'user_specifically_for',
                            select: 'first_name last_name username'
                        })
                        .populate({
                            path: 'user',
                            select: 'first_name last_name username'
                        })
                        .lean(); 
    } else {
        deals = await Deal.find({ $or: [
                                    { title: new RegExp(search_key, 'i') },
                                    { code: new RegExp(search_key, 'i') }
                                ],
                                deleted_at: null })
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .populate({
                            path: 'user_specifically_for',
                            select: 'first_name last_name username'
                        })
                        .populate({
                            path: 'user',
                            select: 'first_name last_name username'
                        })
                        .lean(); 
    }

    if (!deals?.length) return res.status(404).json({ message: "No deals found!" }); 

    const total = await Deal.countDocuments({ deleted_at: null });

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: deals 
            });
});

/**
 * CREATE DEAL
 */
const createDeal = asyncHandler(async (req, res) => {
    const { code, 
            title, 
            description, 
            value, 
            value_unit, 
            specific_for_user, 
            user_specifically_for, 
            usable_once } = req?.body; 

    let userFound; 

    if (specific_for_user) {
        userFound = await User.findOne({ username: user_specifically_for }); 

        if (!userFound) return res.status(404).json({ message: `User does not exist` }); 
    }

    let dealImageUpload = {};
    if (!req?.files?.image_path) {
        dealImageUpload.public_id = ''
        dealImageUpload.secure_url = ''
    } else if (req?.files?.image_path) {
        dealImageUpload = await cloudinaryImageUpload(req?.files?.image_path.tempFilePath, "deezysdeals_deal_images"); 
        if (!dealImageUpload) return res.status(400).json({ message: "Image upload failed" }); 
    }

    const deal = new Deal({
        user: req?.user_id, 
        code, 
        title, 
        slug: slugIt(title), 
        description: description ?? '', 
        image_path: { 
            public_id: dealImageUpload.public_id,
            url: dealImageUpload.secure_url
        }, 
        value, 
        value_unit: (value_unit == 'undefined') ? 'usd' : value_unit, 
        specific_for_user, 
        user_specifically_for: userFound?._id, 
        usable_once 
    }); 

    deal.save()
        .then(() => {
            res.status(201).json({ success: `Deal ${deal.title} added`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 
}); 

/**
 * GET A DEAL
 */
const getDeal = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const { id } = req?.params; 

	const deal = await Deal.findOne({ _id: id })
                            .select(['-deleted_at'])
                            .populate({
                                path: 'user_specifically_for',
                                select: 'first_name last_name username'
                            })
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean();

	if (!deal) return res.status(404).json({ message: `No deal matches deal ${req?.params?.id}!` }); 

    // const products = await DealProduct.find({ deal: deal?._id })
    //                                 .sort('-created_at')
    //                                 .skip(skip)
    //                                 .limit(limit)
    //                                 .populate({
    //                                     path: 'product', 
    //                                 })
    //                                 .lean(); 

    // const total = await DealProduct.countDocuments({ deal: deal?._id }); 

    const products = await Product.find({ deal: deal?._id })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(); 

    const total = await Product.countDocuments({ deal: deal?._id }); 

    let dealObj = deal; 

    dealObj.products = products;
    dealObj.products.current_page = current_page;
    dealObj.products.limit = limit;
    dealObj.products.total_pages = Math.ceil(total / limit);
    dealObj.products.total_results = total; 

	// res.status(200).json({ data: deal }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: dealObj 
            });
}); 

/**
 * UPDATE A DEAL
 */
const updateDeal = asyncHandler(async (req, res) => {
    const { code, 
            title, 
            description, 
            value, 
            value_unit, 
            specific_for_user, 
            user_specifically_for, 
            usable_once } = req?.body; 

    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();
    if (!deal) return res.status(404).json({ message: "Deal not found!" }); 

    /** Image Upload */
    let dealImageUpload = {};
    if (!req?.files?.image_path) {
        dealImageUpload.public_id = ''
        dealImageUpload.secure_url = ''
    } else if (req?.files?.image_path) {
        dealImageUpload = await cloudinaryImageUpload(req?.files?.image_path.tempFilePath, "deezysdeals_deal_images"); 
        if (!dealImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        deal.image_path.public_id = dealImageUpload.public_id
        deal.image_path.url = dealImageUpload.secure_url
    }
    /** End of Image upload */

    if (code) deal.code = code; 
    if (title) deal.title = title; 
    if (description) deal.description = description; 
    if (value) deal.value = value; 
    if (value_unit) deal.value_unit = value_unit; 
    if (specific_for_user) deal.specific_for_user = specific_for_user; 
    if (user_specifically_for) deal.user_specifically_for = user_specifically_for; 
    if (usable_once) deal.usable_once = usable_once; 

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deal record updated.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * SOFT-DELETE A DEAL
 */
const deleteDeal = asyncHandler(async (req, res) => { 
    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();

    if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

    if (deal.deleted_at == '' || deal.deleted_at == null) {
        deal.deleted_at = new Date().toISOString();
        deal.deleted_by = req?.user_id;
    }

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deal record deleted.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED DEAL
 */
const restoreDeal = asyncHandler(async (req, res) => { 
    const { id } = req?.params; 

    const deal = await Deal.findOne({ _id: id }).exec();

    if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

    if (deal.deleted_at != '' && deal.deleted_at != null) {
        deal.deleted_at = '';
        deal.deleted_by = '';
    }

    deal.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted deal record restored.`, data: deal });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A DEAL
 */
const destroyDeal = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const deal = await Deal.findOne({ _id: id }).exec();

	if (!deal) return res.status(404).json({ message: `No deal matches the deal ${id}!` }); 

	await deal.deleteOne(); 

	res.status(200).json({ success: `Deal ${deal?.code} has been permanently deleted.`, data: `${deal}` });
}); 


export { getDeals, 
		createDeal, 
		getDeal, 
		updateDeal, 
		deleteDeal, 
        restoreDeal, 
        destroyDeal }; 
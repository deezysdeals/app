import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js';
import asyncHandler from 'express-async-handler'; 
import slug from 'slug';
const slugIt = slug; 
import Product from '../models/Product.js'; 
import Brand from '../models/Brand.js'; 


/**
 * GET ALL BRANDS
 */
const getBrands = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

	const brands = await Brand.find({ deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .lean(); 
    if (!brands?.length) return res.status(404).json({ message: "No brands found!" }); 

    const total = await Brand.countDocuments({ deleted_at: null }); 

    // let brandsList = []; 

    // const updatePromises = brands?.map(async brand => { 
    //     let foundProducts = await Product.find({ brand: brand?._id }).exec(); 
    //     brand['products'] = foundProducts; 

    //     brandsList.push(brand);
    // }); 

    // await Promise.all(updatePromises); 

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

/**
 * CREATE BRAND
 */
const createBrand = asyncHandler(async (req, res) => {
    const { name, 
            description, 
            web_address, 
            facebook, 
            instagram, 
            twitter_x, 
            other_social, 
            other_social_handle } = req?.body; 

    const duplicateBrand = await Brand.findOne({ $or: [{ name: name }, { slug: slugIt(name) }] }).lean(); 

    if (duplicateBrand) return res.status(409).json({ message: `Brand ${duplicateBrand.name} already exists` }); 

    // const { logo_path } = req?.files; 

    let brandImageUpload = {};
    if (!req?.files?.logo_path) {
        brandImageUpload.public_id = ''
        brandImageUpload.secure_url = ''
    } else if (req?.files?.logo_path) {
        brandImageUpload = await cloudinaryImageUpload(req?.files?.logo_path.tempFilePath, "deezysdeals_brand_images"); 
        if (!brandImageUpload) return res.status(400).json({ message: "Image upload failed" }); 
    }

    const brand = new Brand({
        user: req?.user_id, 
        name, 
        slug: slugIt(name), 
        description: description ?? '', 
        logo_path: { 
            public_id: brandImageUpload.public_id,
            url: brandImageUpload.secure_url
        }, 
        web_address: web_address ?? '', 
        facebook: facebook ?? '', 
        instagram: instagram ?? '', 
        twitter_x: twitter_x ?? '', 
        other_social: other_social ?? '', 
        other_social_handle: other_social_handle ?? ''
    }); 

    brand.save()
        .then(() => {
            res.status(201).json({ success: `Brand ${brand.name} added`, data: brand });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 
}); 

/**
 * GET A BRAND
 */
const getBrand = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const { id } = req?.params; 

	const brand = await Brand.findOne({ _id: id })
		.select(['-deleted_at'])
		.lean();

	if (!brand) return res.status(404).json({ message: `No brand matches brand ${id}!` }); 

    const products = await Product.find({ brand: brand?._id })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .lean(); 

    const total = await Product.find({ brand: brand?._id }).countDocuments(); 

    let brandObj = brand; 

    // brandObj.products = products; 

    brandObj.products = products;
    brandObj.products.current_page = current_page;
    brandObj.products.limit = limit;
    brandObj.products.total_pages = Math.ceil(total / limit);
    brandObj.products.total_results = total;

	// res.status(200).json({ data: brand }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: brandObj 
            });
}); 

/**
 * UPDATE A BRAND
 */
const updateBrand = asyncHandler(async (req, res) => {
    const { name, 
            description, 
            logo_path, 
            web_address, 
            facebook, 
            instagram, 
            twitter_x, 
            other_social, 
            other_social_handle } = req?.body; 

    const { id } = req?.params; 

    const brand = await Brand.findOne({ _id: id }).exec();
    if (!brand) return res.status(404).json({ message: "Brand not found!" }); 

    /** Image Upload */
    let brandImageUpload = {};
    if (!req?.files?.logo_path) {
        brandImageUpload.public_id = ''
        brandImageUpload.secure_url = ''
    } else if (req?.files?.logo_path) {
        brandImageUpload = await cloudinaryImageUpload(req?.files?.logo_path.tempFilePath, "deezysdeals_brand_images"); 
        if (!brandImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        brand.logo_path.public_id = brandImageUpload.public_id
        brand.logo_path.url = brandImageUpload.secure_url
    }
    /** End of Image upload */

    if (name) brand.name = name; 
    if (description) brand.description = description; 
    // if (req?.files?.logo_path) {
    //     brand.logo_path.public_id = brandImageUpload.public_id
    //     brand.logo_path.url = brandImageUpload.secure_url
    // }
    if (web_address) brand.web_address = web_address; 
    if (facebook) brand.facebook = facebook; 
    if (instagram) brand.instagram = instagram; 
    if (twitter_x) brand.twitter_x = twitter_x; 
    if (other_social) brand.other_social = other_social; 
    if (other_social_handle) brand.other_social_handle = other_social_handle; 

    brand.save()
        .then(() => { 
			res.status(200).json({ success: `Brand record updated.`, data: brand });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * SOFT-DELETE A BRAND
 */
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const brand = await Brand.findOne({ _id: id }).exec();

    if (!brand) return res.status(404).json({ message: `No brand matches the brand ${id}!` }); 

    if (brand.deleted_at == '' || brand.deleted_at == null) {
        brand.deleted_at = new Date().toISOString();
        brand.deleted_by = req?.user_id;
    }

    brand.save()
        .then(() => { 
			res.status(200).json({ success: `Brand record deleted.`, data: brand });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED BRAND
 */
const restoreBrand = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const brand = await Brand.findOne({ _id: id }).exec();

    if (!brand) return res.status(404).json({ message: `No brand matches the brand ${id}!` }); 

    if (brand.deleted_at != '' && brand.deleted_at != null) {
        brand.deleted_at = '';
        brand.deleted_by = '';
    };

    brand.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted brand record restored.`, data: brand });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A BRAND
 */
const destroyBrand = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const brand = await Brand.findOne({ _id: id }).exec();

	if (!brand) return res.status(404).json({ message: `No brand matches the brand ${id}!` }); 

	await brand.deleteOne(); 

	res.status(200).json({ success: `Brand ${brand?._id} has been permanently deleted.`, data: `${brand}` });
}); 


export { getBrands, 
		createBrand, 
		getBrand, 
		updateBrand, 
		deleteBrand, 
        restoreBrand, 
        destroyBrand }; 
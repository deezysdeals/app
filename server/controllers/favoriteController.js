import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import Product from '../models/Product.js';
import ProductImage from '../models/ProductImage.js';
import Category from '../models/Category.js';
import Favorite from '../models/Favorite.js'; 


const getFavorites = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    // const limit = 2; 
    const limit = parseInt(req?.query?.limit) || 10; 
    const searchPhrase = req?.query?.search; 

    const skip = (current_page - 1) * limit; 

    console.log('favorites:', current_page, limit, searchPhrase); 

    console.log('user', req?.user_id)

    let favorites;

    // if (searchPhrase?.length) {
    //     favorites = await Favorite.find({ $or: [
    //                                         { 'product.title': { $text: { $search: searchPhrase } } }, 
    //                                         { 'product.description': { $text: { $search: searchPhrase } } }, 
    //                                     ], 
    //                                     user: req?.user_id })
    //                                 .populate({
    //                                     path: 'product'
    //                                 })
    //                                 .sort('-created_at')
    //                                 .skip(skip)
    //                                 .limit(limit)
    //                                 .lean(); 
    // } else if ((searchPhrase == '') || (searchPhrase == undefined)) {
    //     favorites = await Favorite.find({ user: req?.user_id })
    //                                 .sort('-created_at')
    //                                 .skip(skip)
    //                                 .limit(limit)
    //                                 .populate({
    //                                     path: 'product'
    //                                 })
    //                                 .lean(); 
    // } 
    if (limit == 'all') {
        favorites = await Favorite.find({ user: req?.user_id })
                                .sort('-created_at')
                                .populate({
                                    path: 'product'
                                })
                                .lean(); 
    } else {
        favorites = await Favorite.find({ user: req?.user_id })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'product'
                                })
                                .lean(); 
    }
	
    if (!favorites?.length) return res.status(404).json({ message: "No favorites found!" }); 

    const total = await Favorite.find({ user: req?.user_id }).countDocuments(); 

	// res.json({ data: favorites }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: favorites 
            });
});

const createFavorite = asyncHandler(async (req, res) => {
    const { product } = req?.params; 

    // const productFound = await Product.findOne({ _id: product }).lean();

    // if (!productFound?.length) return res.status(404).json({ message: "No product matches the product key provided!" }); 
    /** Allow only 20 favorites */
    const maximumNumberOfFavorites = await Favorite.countDocuments({ user: req?.user_id }); 
    if (maximumNumberOfFavorites >= 15) return res.status(409).json({ message: 'Maximum favorites: 15. You must delete a favorite to add a new one.'})

    async function fetchProductAndCreateFavorite() {
        try {
            const response = await axios.get(`https://fakestoreapi.com/products/${product}`);
            // console.log('Response:', response?.data); 

            // Create new product (order item), if does not exist
            // const productFilter = { title: response?.data?.title }; 
            const productFilter = { asin: response?.data?.id }; 
            const productUpdate = { user: req?.user_id, 
                                    title: response?.data?.title, 
                                    retail_price: response?.data?.price, 
                                    images: [response?.data?.image] };

            const upsertProduct = await Product.findOneAndUpdate(productFilter, productUpdate, {
                new: true,
                upsert: true 
            }); 
            console.log(upsertProduct); 

            // Create new product Image (order item image), if does not exist
            const productImageFilter = { 'image_path.url': response?.data?.image }; 
            const productImageUpdate = { $set: { product: upsertProduct?._id,
                                                'image_path.$.url': response?.data?.image } }; 

            const upsertProductImage = await ProductImage.findOneAndUpdate(productImageFilter, productImageUpdate, {
                new: true,
                upsert: true 
            }); 
            console.log(upsertProductImage); 

            // Create new category, if does not exist 
            const categoryFilter = { name: response?.data?.category }; 
            const categoryUpdate = { user: req?.user_id }; 

            const upsertCategory = await Category.findOneAndUpdate(categoryFilter, categoryUpdate, {
                new: true, 
                upsert: true 
            }); 
            console.log(upsertCategory); 

            /** Finally, create the Favorite if it does not exist */ 
            const favoriteAlreadyExists = await Favorite.findOne({
                user: req?.user_id, 
                product: upsertProduct?._id
            }).lean();

            if (!favoriteAlreadyExists) {
                const favorite = new Favorite({
                    user: req?.user_id, 
                    product: upsertProduct?._id, 
                    // asin: response?.data?.id
                }); 

                favorite.save()
                    .then(() => {
                        res.status(201).json({ success: `Favorite ${favorite._id} added`, data: favorite });
                    })
                    .catch((error) => {
                        if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                    });
            } else if (favoriteAlreadyExists) {
                Favorite.findOneAndDelete({
                        user: req?.user_id, 
                        product: upsertProduct?._id
                    })
                    .then(result => {
                        console.log('Favorite deleted:', result);
                    })
                    .catch(error => {
                        console.error('Error deleting favorite:', error);
                    });
            }

        } catch (error) {
            console.error('Error:', error);
        } 
    }
    fetchProductAndCreateFavorite(); 
 
}); 

const getFavorite = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
	const favorite = await Favorite.findOne({ _id: id })
		.select(['-created_at', '-updated_at', '-deleted_at'])
        .populate({
            path: 'product'
        })
		.lean();

	if (!favorite) return res.status(404).json({ message: `No favorite matches favorite ${req?.params?.id}!` });
	res.status(200).json({ data: favorite });
}); 

const deleteFavorite = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const favorite = await Favorite.findOne({ _id: id }).exec();

	if (!favorite) return res.status(404).json({ message: `No favorite matches the favorite ${id}!` }); 

	await favorite.deleteOne(); 

	res.status(200).json({ success: `Favorite ${favorite?.code} has been permanently deleted.`, data: `${favorite}` });
}); 


export { getFavorites, 
		createFavorite, 
		getFavorite, 
		deleteFavorite }; 
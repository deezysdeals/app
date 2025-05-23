import asyncHandler from 'express-async-handler'; 
import ProductInfo from '../models/ProductInfo.js'


const deleteProductInfo = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productInfo = await ProductInfo.findOne({ _id: id }).exec();

    if (!productInfo) return res.status(404).json({ message: `No product info matches the product info ${id}!` }); 

    if (productInfo.deleted_at == ('' || null)) {
        productInfo.deleted_at = new Date().toISOString();
        productInfo.deleted_by = req?.user_id;
    }

    productInfo.save()
        .then(() => { 
			res.status(200).json({ success: `Product info record deleted.`, data: productInfo });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreProductInfo = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productInfo = await ProductInfo.findOne({ _id: id }).exec();

    if (!productInfo) return res.status(404).json({ message: `No product info matches the product info ${id}!` }); 

    if (productInfo.deleted_at != ('' || null)) {
        productInfo.deleted_at = null;
        productInfo.deleted_by = '';
    };

    productInfo.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product info record restored.`, data: productInfo });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroyProductInfo = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const productInfo = await ProductInfo.findOne({ _id: id }).exec();

	if (!productInfo) return res.status(404).json({ message: `No product info matches the product info ${id}!` }); 

	await productInfo.deleteOne(); 

	res.status(200).json({ success: `Product info ${productInfo?._id} has been permanently deleted.`, data: `${productInfo}` });
}); 


export { deleteProductInfo, 
        restoreProductInfo, 
        destroyProductInfo }; 
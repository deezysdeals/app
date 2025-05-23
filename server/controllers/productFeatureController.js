import asyncHandler from 'express-async-handler'; 
import ProductFeature from '../models/ProductFeature.js'


const deleteProductFeature = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productFeature = await ProductFeature.findOne({ _id: id }).exec();

    if (!productFeature) return res.status(404).json({ message: `No product feature matches the product feature ${id}!` }); 

    if (productFeature.deleted_at == ('' || null)) {
        productFeature.deleted_at = new Date().toISOString();
        productFeature.deleted_by = req?.user_id;
    }

    productFeature.save()
        .then(() => { 
			res.status(200).json({ success: `Product feature record deleted.`, data: productFeature });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreProductFeature = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productFeature = await ProductFeature.findOne({ _id: id }).exec();

    if (!productFeature) return res.status(404).json({ message: `No product feature matches the product feature ${id}!` }); 

    if (productFeature.deleted_at != ('' || null)) {
        productFeature.deleted_at = null;
        productFeature.deleted_by = '';
    };

    productFeature.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product feature record restored.`, data: productFeature });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroyProductFeature = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const productFeature = await ProductFeature.findOne({ _id: id }).exec();

	if (!productFeature) return res.status(404).json({ message: `No product feature matches the product feature ${id}!` }); 

	await productFeature.deleteOne(); 

	res.status(200).json({ success: `Product feature ${productFeature?._id} has been permanently deleted.`, data: `${productFeature}` });
}); 


export { deleteProductFeature, 
        restoreProductFeature, 
        destroyProductFeature }; 
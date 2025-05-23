import asyncHandler from 'express-async-handler'; 
import ProductDescription from '../models/ProductDescription.js'


const deleteProductDescription = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productDescription = await ProductDescription.findOne({ _id: id }).exec();

    if (!productDescription) return res.status(404).json({ message: `No product description matches the product description ${id}!` }); 

    if (productDescription.deleted_at == ('' || null)) {
        productDescription.deleted_at = new Date().toISOString();
        productDescription.deleted_by = req?.user_id;
    }

    productDescription.save()
        .then(() => { 
			res.status(200).json({ success: `Product description record deleted.`, data: productDescription });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreProductDescription = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productDescription = await ProductDescription.findOne({ _id: id }).exec();

    if (!productDescription) return res.status(404).json({ message: `No product description matches the product description ${id}!` }); 

    if (productDescription.deleted_at != ('' || null)) {
        productDescription.deleted_at = null;
        productDescription.deleted_by = '';
    };

    productDescription.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product description record restored.`, data: productDescription });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroyProductDescription = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const productDescription = await ProductDescription.findOne({ _id: id }).exec();

	if (!productDescription) return res.status(404).json({ message: `No product description matches the product description ${id}!` }); 

	await productDescription.deleteOne(); 

	res.status(200).json({ success: `Product description ${productDescription?._id} has been permanently deleted.`, data: `${productDescription}` });
}); 


export { deleteProductDescription, 
        restoreProductDescription, 
        destroyProductDescription }; 
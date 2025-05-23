import asyncHandler from 'express-async-handler'; 
import CategoryProduct from '../models/CategoryProduct.js'


const deleteCategoryProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const categoryProduct = await CategoryProduct.findOne({ _id: id }).exec();

    if (!categoryProduct) return res.status(404).json({ message: `No product category matches the product category ${id}!` }); 

    if (categoryProduct.deleted_at == ('' || null)) {
        categoryProduct.deleted_at = new Date().toISOString();
        categoryProduct.deleted_by = req?.user_id;
    }

    categoryProduct.save()
        .then(() => { 
			res.status(200).json({ success: `Product category record deleted.`, data: categoryProduct });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const restoreCategoryProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const categoryProduct = await CategoryProduct.findOne({ _id: id }).exec();

    if (!categoryProduct) return res.status(404).json({ message: `No product category matches the product category ${id}!` }); 

    if (categoryProduct.deleted_at != ('' || null)) {
        categoryProduct.deleted_at = null;
        categoryProduct.deleted_by = '';
    };

    categoryProduct.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product category record restored.`, data: categoryProduct });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

const destroyCategoryProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const categoryProduct = await CategoryProduct.findOne({ _id: id }).exec();

	if (!categoryProduct) return res.status(404).json({ message: `No product category matches the product category ${id}!` }); 

	await categoryProduct.deleteOne(); 

	res.status(200).json({ success: `Product category ${categoryProduct?._id} has been permanently deleted.`, data: `${categoryProduct}` });
}); 


export { deleteCategoryProduct, 
        restoreCategoryProduct, 
        destroyCategoryProduct }; 
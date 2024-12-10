import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const discountProductSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        discount: { type: Schema.Types.ObjectId, ref: 'Discount' }, 
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DiscountProduct = mongoose.model("DiscountProduct", discountProductSchema);
export default DiscountProduct; 
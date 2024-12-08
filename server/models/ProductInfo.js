import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const productInfoSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        // dynamic_data: { type: Schema.Types.Mixed, required: true }, 
        dynamic_data: { type: Map, of: Schema.Types.Mixed}, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ProductInfo = mongoose.model("ProductInfo", productInfoSchema);
export default ProductInfo; 
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dealProductSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        deal: { type: Schema.Types.ObjectId, ref: 'Deal' }, 
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DealProduct = mongoose.model("DealProduct", dealProductSchema);
export default DealProduct; 
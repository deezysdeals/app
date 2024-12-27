import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const orderItemSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        order: { type: Schema.Types.ObjectId, ref: 'Order' }, 
        order_paid: { type: Boolean, default: false }, 
        quantity: { type: Number, default: 0 }, 
        price: { type: Number, default: 0 }, 
        cost_price: { type: Number, default: 0 }, 
        selling_price: { type: Number, default: 0 }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 


let OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem; 
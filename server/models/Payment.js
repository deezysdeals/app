import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const paymentSchema = Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        order: { type: Schema.Types.ObjectId, ref: 'Order' }, 
        amount: { type: Number, required: true }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 


let Payment = mongoose.model("Payment", paymentSchema); 
export default Payment; 
import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const notificationSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        order: { type: Schema.Types.ObjectId, ref: 'Order' }, 
        read: { type: Boolean, default: false }, 
        read_at: { type: String, default: null },
        type: { 
            type: String, 
            required: true, 
            enum: ['bonus', 'delivery', 'enquiry', 'order', 'delivery-arrival'], 
            default: 'bonus'
        }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Notification = mongoose.model("Notification", notificationSchema);
export default Notification; 
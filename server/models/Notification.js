import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const notificationSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        read: { type: Boolean, default: false }, 
        type: { 
            type: String, 
            required: true, 
            enum: ['bonus', 'delivery', 'enquiry', 'order', 'order-arrival'], 
            default: 'bonus'
        }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Notification = mongoose.model("Notification", notificationSchema);
export default Notification; 
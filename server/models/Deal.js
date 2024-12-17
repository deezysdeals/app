import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dealSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId,  ref: 'User' }, 
        title: { type: String, required: true, unique: true }, 
        description: { type: String, required: true }, 
        slug: { type: String, required: true }, 
        code: { type: String, required: true }, 
        value: { type: Number, required: true }, 
        value_unit: { 
            type: String, 
            required: true, 
            enum: ['percentage', 'usd'], 
            default: 'percentage' 
        }, 
        image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        }, 
        usable_once: { type: Boolean, default: false }, 
        used_at: { type: String, default: null },
        used_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        specific_for_user: { type: Boolean, default: false }, 
        user_specifically_for: { type: Schema.Types.ObjectId, ref: 'User' }, 
        updated_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        // expires_on: { type: String, default: null }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Deal = mongoose.model('Deal', dealSchema);
export default Deal; 
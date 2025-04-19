import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const socialPostSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        message: { type: String }, 
        media: [ { type: String } ], 
        network: { 
            type: String, 
            required: true, 
            enum: ['facebook', 'instagram', 'tik-tok', 'twitter-x'], 
            default: 'twitter-x' 
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let SocialPost = mongoose.model("SocialPost", socialPostSchema);
export default SocialPost; 
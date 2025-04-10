import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const twitterXTweetSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        message: { type: String }, 
        media: [ { type: String } ], 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let TwitterXTweet = mongoose.model("TwitterXTweet", twitterXTweetSchema);
export default TwitterXTweet; 
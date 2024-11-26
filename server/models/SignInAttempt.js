import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const signInAttemptSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        ip_address: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let SignInAttempt = mongoose.model("SignInAttempt", signInAttemptSchema);
export default SignInAttempt; 
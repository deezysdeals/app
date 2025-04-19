import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const newsletterSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        title: { type: String, required: true }, 
        content: { type: String, required: true }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

newsletterSchema.index({ name: 'text' }); 


let Newsletter = mongoose.model("Newsletter", newsletterSchema);
export default Newsletter; 
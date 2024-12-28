import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const categorySchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        name: { 
            type: String, 
            minLength: 1, 
            unique: true 
        }, 
        link: { type: String }, 
        order_count: { type: Number, default: 0 }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

let Category = mongoose.model('Category', categorySchema); 
export default Category; 
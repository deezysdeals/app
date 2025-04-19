import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const clientQuerySchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        title: { 
            type: String, 
            minLength: 1
        }, 
        responder: { type: Schema.Types.ObjectId, ref: 'User' }, 
        solved: { type: Boolean, default: false }, 
        marked_solved_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' } 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

let ClientQuery = mongoose.model('ClientQuery', clientQuerySchema); 
export default ClientQuery; 
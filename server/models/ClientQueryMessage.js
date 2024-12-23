import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const clientQueryMessageSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        client_query: { type: Schema.Types.ObjectId, ref: 'ClientQuery' }, 
        message: { 
            type: String, 
            minLength: 1, 
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' } 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

let ClientQueryMessage = mongoose.model('ClientQueryMessage', clientQueryMessageSchema); 
export default ClientQueryMessage; 
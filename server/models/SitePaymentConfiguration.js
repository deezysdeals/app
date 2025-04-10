import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const sitePaymentConfigurationSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        initial_setup: { type: Boolean, default: true }, 
        type: { 
            type: String, 
            required: true, 
            enum: ['amount', 'percentage'], 
            default: 'percentage'
        }, 
        unit: { type: Number },
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let SitePaymentConfiguration = mongoose.model("SitePaymentConfiguration", sitePaymentConfigurationSchema);
export default SitePaymentConfiguration; 
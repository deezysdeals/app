import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const productSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, 
        model: { type: String }, 
        // deal: { type: Schema.Types.ObjectId, ref: 'Deal' }, 
        // category: { type: Schema.Types.ObjectId, ref: 'Category' }, 
        // sub_category: { type: Schema.Types.ObjectId, ref: 'SubCategory' }, 
        asin: { type: String, minLength: 1, unique: true }, 
        title: { type: String, required: true }, 
        slug: { type: String, required: true }, 
        // description: { type: String }, 
        // features: { type: String, default: '' }, 
        featured: { type: Boolean, default: false }, 
        initial_retail_price: { type: Number }, 
        retail_price: { type: Number, required: true }, 
        currency: { type: String, default: 'usd' }, 
        images: [ String ], 
        dimensions: {
            height: { type: String },
            width: { type: String },
            depth: { type: String },
            weight: { type: String }
        },
        purchased_for_resale: { type: Boolean, default: false }, 
        purchase_price: { type: Number }, 
        sold_to_client: { type: Boolean, default: false }, 
        price_sold_to_client: { type: Number }, 
        order_count: { type: Number }, 
        proposed_delivery_start_date: { type: Date }, 
        proposed_delivery_destination_reach_date: { type: Date }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

productSchema.index({ title: 'text', description: 'text' }); 


let Product = mongoose.model("Product", productSchema);
export default Product; 
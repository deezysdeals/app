import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const productSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        brand: { type: Schema.Types.ObjectId, ref: 'Brand' }, 
        deal: { type: Schema.Types.ObjectId, ref: 'Deal' }, 
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
        purchased_from_amazon_market: { type: Boolean, default: false }, 
        purchased_for_resale: { type: Boolean, default: false }, 
        purchase_price: { type: Number }, 
        initial_retail_price: { type: Number }, 
        retail_price: { type: Number, required: true }, 
        // sold_to_client: { type: Boolean, default: false }, 
        // price_sold_to_client: { type: Number }, 
        order_count: { type: Number, default: 0 }, 
        sale_count: { type: Number, default: 0 }, 
        currency: { type: String, default: 'usd' }, 
        images: [ String ], 
        dimensions: {
            height: { type: String },
            width: { type: String },
            depth: { type: String },
            weight: { type: String }
        },
        proposed_delivery_start_date: { type: Date }, 
        proposed_delivery_destination_reach_date: { type: Date }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 

productSchema.virtual('purchase_price_virtual').get(function () {
  return this.purchase_price / 100;  
});
productSchema.virtual('purchase_price_virtual').set(function (value) {
  this.purchase_price = Math.round(value * 100); 
});

productSchema.virtual('initial_retail_price_virtual').get(function () {
  return this.initial_retail_price / 100;  
});
productSchema.virtual('initial_retail_price_virtual').set(function (value) {
  this.initial_retail_price = Math.round(value * 100); 
});

productSchema.virtual('retail_price_virtual').get(function () {
  return this.retail_price / 100;  
});
productSchema.virtual('retail_price_virtual').set(function (value) {
  this.retail_price = Math.round(value * 100); 
});

productSchema.set('toJSON', {
  virtuals: true,
});

productSchema.index({ title: 'text', description: 'text' }); 


let Product = mongoose.model("Product", productSchema);
export default Product; 
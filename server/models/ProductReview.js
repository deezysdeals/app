import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const productReviewSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        // product_unit: { type: Schema.Types.ObjectId, ref: 'ProductUnit' }, 
        order: { type: Schema.Types.ObjectId, ref: 'Order' }, 
        order_item: { type: Schema.Types.ObjectId, ref: 'OrderItem' }, 
        review_index: { type: Number }, 
        title: { type: String, required: true }, 
        content: { type: String, required: true }, 
        rating: { 
            type: Number, 
            enum: [1, 2, 3, 4, 5] 
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ProductReview = mongoose.model("ProductReview", productReviewSchema);
export default ProductReview; 
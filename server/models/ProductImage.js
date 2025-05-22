import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const productImageSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' },   
        product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
        image_index: { type: Number }, 
        // slug: { type: String, required: true }, 
        // description: { type: String, required: true }, 
        image_path: [
            {
                hi_res: { 
                            public_id: { type: String, default: '' },
                            url: { type: String, default: '' }
                        },
                large: { 
                            public_id: { type: String, default: '' },
                            url: { type: String, default: '' }
                        },
                thumb: { 
                            public_id: { type: String, default: '' },
                            url: { type: String, default: '' }
                        }
            }
        ],
        // image_path: { 
        //     public_id: { type: String, default: '' },
        //     url: { type: String, default: '' }
        // }, 
        is_product_default_image: { type: Boolean, default: false }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ProductImage = mongoose.model("ProductImage", productImageSchema);
export default ProductImage; 
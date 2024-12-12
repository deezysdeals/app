import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const siteConfigurationSchema = new Schema({ 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        homepage_product_review_hero: { type: Schema.Types.ObjectId, ref: 'ProductReview' }, 
        homepage_hero_text_1_heading: { type: String }, 
        homepage_hero_text_1_content: { type: String }, 
        homepage_hero_text_2_heading: { type: String }, 
        homepage_hero_text_2_content: { type: String }, 
        homepage_hero_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        }, 
        homepage_product_review_footer: { type: Schema.Types.ObjectId, ref: 'ProductReview' }, 
        homepage_footer_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        }, 
        /** Payment Configuration */ 

        /** End of Payment Configuration */ 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let SiteConfiguration = mongoose.model("SiteConfiguration", siteConfigurationSchema);
export default SiteConfiguration; 
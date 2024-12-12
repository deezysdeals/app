import bcrypt from 'bcrypt'; 
import mongoose from 'mongoose'; 

const Schema = mongoose.Schema; 

const newsletterSubscriptionSchema = new Schema({
        email: { 
            type: String,
            required: [true, 'Email address is required'], 
            unique: true,
            validate: {
                validator: function(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }, 
        subscribed_at: { type: String, default: null }, 
        deleted_at: { type: String, default: null } 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
); 


let NewsletterSubscription = mongoose.model("NewsletterSubscription", newsletterSubscriptionSchema);
export default NewsletterSubscription; 
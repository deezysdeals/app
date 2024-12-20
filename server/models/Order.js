import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const orderSchema = new Schema({
        user: { type: Schema.Types.ObjectId,  ref: 'User' }, 
        deal: { type: Schema.Types.ObjectId,  ref: 'Deal' }, 
        // order_items: [
        //     {
        //         name: { type: String, required: true },
        //         quantity: { type: Number, required: true },
        //         image: { type: String },
        //         price: { type: Number, required: true },
        //         product: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             required: true,
        //             ref: 'Product'
        //         },
        //     },
        // ], 
        paypal_order_id: { type: String }, 
        paypal_payer_id: { type: String }, 
        paypal_payment_id: { type: String }, 
        delivery_mode: { type: Schema.Types.ObjectId, ref: 'DeliveryMode' }, 
        delivery_status: { 
            type: String, 
            required: true, 
            enum: ['undelivered', 'delivered'], 
            default: 'undelivered'
        }, 
        delivery_cost: { type: Number }, 
        payment_mode:  { 
            type: String, 
            required: true, 
            enum: ['unpaid', 'cash', 'card', 'paypal'], 
            default: 'unpaid'
        }, 
        billing_status: { 
            type: String, 
            required: true, 
            enum: ['unpaid', 'pay-on-delivery', 'paying-with-cash', 'paying-with-card', 'paying-with-paypal'], 
            default: 'unpaid'
        }, 
        total_to_be_paid: { type: Number }, 
        currency: { 
            type: String, 
            enum: ['usd', 'eur'], 
            default: 'usd'
        }, 
        paid: { type: Boolean, default: false }, 
        total_paid: { type: Number }, 
        total_balance: { type: Number }, 
        cancelled: { type: Boolean, default: false }, 
        need_refund: { type: Boolean, default: false }, 
        refunded_at: { type: String, default: null }, 
        proposed_delivery_start_date: { type: Date }, 
        proposed_delivery_destination_reach_date: { type: Date }, 
        delivery_date: { type: Date }, 
        delivery_confirmed_by_recipient_at: { type: String, default: null }, 
        delivered_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        full_name: { 
            type: String, 
            required: true 
        }, 
        email: { 
            type: String,
            required: [true, 'Email address is required'], 
            validate: {
                validator: function(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }, 
        phone: { 
            type: String, 
            required: [true, 'Phone number is required'], 
            validate: {
                validator: function(phone) {
                    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                    return phoneRegex.test(phone);
                }, 
                message: props => `${props.value} is not a valid phone number.`
            } 
        }, 
        address_line_1: { 
            type: String, 
            minLength: 3, 
            maxLength: 245,
            required: true 
        }, 
        address_line_2: { 
            type: String, 
            minLength: 3, 
            maxLength: 245, 
        }, 
        post_code: { 
            type: String, 
            minLength: 3, 
            maxLength: 15
        }, 
        town_city: { 
            type: String, 
            minLength: 3, 
            maxLength: 45
        }, 
        state_region: { 
            type: String, 
            minLength: 3, 
            maxLength: 45
        }, 
        country: { 
            type: String, 
            minLength: 3, 
            maxLength: 123, 
            default: 'Mauritius'
        }, 
        delivery_instructions: { 
            type: String, 
            minLength: 3, 
            maxLength: 245
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Order = mongoose.model("Order", orderSchema);
export default Order; 
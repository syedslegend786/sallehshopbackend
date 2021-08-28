import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    images: {
        type: Object,
        required: true,
    },
    catagory: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    sold: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model('products', productSchema)
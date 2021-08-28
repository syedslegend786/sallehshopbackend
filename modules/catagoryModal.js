import mongoose from 'mongoose'

const catagorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true })

export default mongoose.model('catagories', catagorySchema)
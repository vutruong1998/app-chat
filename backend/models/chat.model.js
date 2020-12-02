import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 225
    },
    avatar: {
        type: String,
        min: 6,
        max: 255
    },
    created_at: {
        type: Date,
        default : Date.now
    }
});

export default mongoose.model('Chat', chatSchema);
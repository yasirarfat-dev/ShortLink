import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    user_agent: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

userSchema.index({ ip: 1, user_agent: 1 }, { unique: true });

export default mongoose.model('User', userSchema);

import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    alias: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clicks: { type: Number, default: 0 },
}, { timestamps: true });


export default mongoose.model("ShortUrl", shortUrlSchema);


import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    actor: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    entity: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: "onModel",
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "comment", "reply"],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    onModel: {
        type: String,
        required: true,
        enum: ["Post", "Comment"],
    },
});

export const Notification = mongoose.model("Notification", notificationSchema);

import mongoose from "mongoose";

const instructorSchema = mongoose.Schema({
    instructorName: {
        type: String,
        required: [true, "Please enter instructor name"],
        maxLength: [100, "Instructor name cannot exceed 100 characters"],
    },
    instructorImage: {
        public_id: String,
        url: String,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    reviewRating: {
        type: Number,
        default: 0,
    },
    zambeelRating: {
        type: Number,
        default: 0,
    },
    profileDescription: {
        type: String,
        required: [true, "Please enter instructor description"],
    },
    instructorReviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
          },
    ]
})

export const Instructor = mongoose.model("Instructor", instructorSchema);

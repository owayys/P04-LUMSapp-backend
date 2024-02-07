import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      required: true
    },
    ratingGiven: {
      type: Number,
      required: true
    },
    reviewDescription: {
      type: String,
      required: true
    },
    instructorID: {  // instructor name is refered from the instructor model
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Instructor', 
      required: true
    }
  });
  
  // Create a model based on the schema
export const Review = mongoose.model('Review', reviewSchema);
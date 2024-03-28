import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter location name"],
    maxLength: [200, "Location name cannot exceed 200 characters"],
  },
  coordinates: {
    type: [Number],
    required: [true, "Please enter location coordinates"],
  },
});

export const Location = mongoose.model("Location", locationSchema);

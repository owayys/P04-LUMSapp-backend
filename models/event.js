import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter event name"],
    maxLength: [400, "Event name cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter event description"],
    maxLength: [2000, "Event description cannot exceed 2000 characters"],
  },
  startTime: {
    type: Date,
    required: [true, "Please enter event start time"],
  },
  endTime: {
    type: Date,
    required: [true, "Please enter event end time"],
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
    required: [true, "Please enter event location"],
  },
  locationName: {
    type: String,
    required: [true, "Please enter event location name"],
  },
  coordinates: {
    type: [Number],
    required: [true, "Please enter event coordinates"],
  },
  category: {
    type: String,
    required: [true, "Please enter event category"],
    maxLength: [200, "Event category cannot exceed 200 characters"],
  },
  image: {
    public_id: String,
    url: String,
  },
  postedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model("Event", eventSchema);

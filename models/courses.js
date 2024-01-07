import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter course name"],
    maxLength: [200, "Course name cannot exceed 200 characters"],
  },
  section: {
    type: String,
    required: [true, "Please enter course section"],
    maxLength: [10, "Course section cannot exceed 10 characters"],
  },
  courseCode: {
    type: String,
    required: [true, "Please enter course code"],
    maxLength: [10, "Course code cannot exceed 10 characters"],
  },
  startTime: {
    type: String,
    required: [true, "Please enter course start time"],
  },
  endTime: {
    type: String,
    required: [true, "Please enter course end time"],
  },
  days: {
    type: [String],
    required: [true, "Please enter course days"],
  },
  instructor: {
    type: String,
    required: [true, "Please enter course instructor"],
    maxLength: [200, "Course instructor cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter course description"],
    maxLength: [2000, "Course description cannot exceed 2000 characters"],
  },
  location: {
    type: String,
    required: [true, "Please enter course location"],
    maxLength: [200, "Course location cannot exceed 200 characters"],
  },
});

export const Course = mongoose.model("Course", courseSchema);

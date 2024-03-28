import { Course } from "../models/courses.js";
import { User } from "../models/user.js";

export const createCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const {
      name,
      section,
      courseCode,
      startTime,
      endTime,
      days,
      instructor,
      description,
      location,
    } = req.body;

    if (
      !name ||
      !section ||
      !courseCode ||
      !startTime ||
      !endTime ||
      !days ||
      !instructor ||
      !description ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const course = await Course.create({
      name,
      section,
      courseCode,
      startTime,
      endTime,
      days,
      instructor,
      description,
      location,
    });

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    let courses = await Course.find();

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

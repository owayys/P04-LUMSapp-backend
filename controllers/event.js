import { User } from "../models/user.js";
import { Event } from "../models/event.js";
import { Location } from "../models/location.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, category } =
      req.body;

    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location
      // ||
      // !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    if (
      user.role !== "admin" &&
      user.role !== "society" &&
      user.role !== "student_council"
    ) {
      console.log(user.role);
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create an event",
      });
    }

    const loc = await Location.findOne({ name: location });

    if (!loc) {
      return res.status(400).json({
        success: false,
        message: "Location not found",
      });
    }

    let temp_cat = "";

    if (category) {
      temp_cat = category;
    } else {
      temp_cat = "General";
    }

    const event = await Event.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location: loc._id,
      locationName: loc.name,
      coordinates: loc.coordinates,
      category: temp_cat,
      postedBy: user._id,
      image: {
        public_id: "",
        url: "",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const todayDate = new Date();

    const events = await Event.find({
      startTime: {
        $gte: new Date(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          todayDate.getDate(),
          1
        ),
      },
    }).populate("postedBy", "fullname _id");

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const mostRecentEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const todayDate = new Date();

    const events = await Event.findOne({
      startTime: {
        $gte: new Date(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          todayDate.getDate(),
          1
        ),
      },
    })
      .sort({ dateField: 1 })
      .limit(1)
      .populate("postedBy", "fullname _id");

    return res.status(200).json({
      success: true,
      message: "Most recent event retrieved successfully",
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getEvent = async (req, res) => {};

export const updateEvent = async (req, res) => {};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.postedBy !== user.fullname) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

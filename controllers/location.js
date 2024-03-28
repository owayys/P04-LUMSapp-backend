import { Location } from "../models/location.js";
import { User } from "../models/user.js";

export const createLocation = async (req, res) => {
  try {
    const { name, coordinates } = req.body;

    if (!name || !coordinates) {
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

    if (user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create a location",
      });
    }

    const locationExists = await Location.findOne({ name });

    if (locationExists) {
      return res.status(400).json({
        success: false,
        message: "Location already exists",
      });
    }

    const location = await Location.create({
      name,
      coordinates,
    });

    return res.status(200).json({
      success: true,
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    console.log("Error: Unable to create location");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLocations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }
    const locations = await Location.find();

    return res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.log("Error: Unable to get locations");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLocation = async (req, res) => {
  try {
    const { locName } = req.body;

    if (!locName) {
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

    const location = await Location.findOne({ locName });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    console.log("Error: Unable to get location");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

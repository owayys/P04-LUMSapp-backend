import { User } from "../models/user.js";
import { Instructor } from "../models/instructor.js";

export const getInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const instructorName = req.body.body;

    const instructorInfo = await Instructor.findOne({ instructorName: instructorName });

    if (!instructorInfo) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }
    else {
      return res.status(200).json({ success: true, instructor: instructorInfo });
    }
  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}


import { User } from "../models/user.js";
import { Instructor } from "../models/instructor.js";
import { Review } from "../models/reviews.js";

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

    // Recalculate rating for the instructor
    const reviews = await Review.find({ instructorID: instructorInfo._id });
    const totalRating = reviews.reduce((sum, review) => sum + review.ratingGiven, 0);
    if (reviews.length === 0) {
      instructorInfo.reviewRating = 0;
    }
    else {
      const averageRating = Math.round(totalRating / reviews.length);   
      instructorInfo.reviewRating = averageRating
    }

    // Recalculate the count for the instructor
    const totalcount = reviews.length;
    instructorInfo.reviewCount = totalcount

    instructorInfo.save()
    
    // Get all reviews for the instructor
    const reviewsForInstructor = await Review.find({ instructorID: instructorInfo._id });

    if (!instructorInfo) {
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }
    else {
      return res.status(200).json({ success: true, instructorInformation: instructorInfo, userID: req.user._id, reviewsInformation: reviewsForInstructor});
    }
  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}


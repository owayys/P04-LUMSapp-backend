import { User } from "../models/user.js";
import { Review } from "../models/reviews.js";
import { Instructor } from "../models/instructor.js"; 

export const createReview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const instructorName = req.body.instructorName;
    const instructorInfo = await Instructor.findOne({ instructorName: instructorName });

    if (req.user.profile_picture.url === "")
    {
      req.user.profile_picture.url = "https://www.gravatar.com/avatar/"
    }

    const newReview = new Review({
      username: req.user.fullname,
      profilePicture: req.user.profile_picture.url,
      ratingGiven: req.body.ratingGiven,
      reviewDescription: req.body.reviewDescription,
      instructorID: instructorInfo._id,
      instructorName: instructorName,
      reviewedBy: req.user._id,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Respond with success message and the saved review data
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: savedReview,
    });
  } catch (err) {
    console.error("Error creating review:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const reviewID = req.body.reviewID;
    // console.log(reviewID)

    const review = await Review.findById(reviewID);

    if (!review) {
      return res.status(404).json({
      success: false,
      message: "Review not found",
      });
    }

    // Check if the review was created by the authenticated user
    if (review.reviewedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
      success: false,
      message: "Unauthorized to delete this review",
      });
    }

    // Delete the review from the database
    await review.deleteOne({reviewID: reviewID, reviewedBy: req.user._id});

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
    
  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const editReview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }
    
    const reviewID = req.body.reviewID;
    const review = await Review.findById(reviewID);

    if (!review) {
      return res.status(404).json({
      success: false,
      message: "Review not found",
      });
    }

    review.reviewDescription = req.body.reviewDescription;
    review.save()


    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
    
  } catch (err) {
    console.error("Error updating review:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

}
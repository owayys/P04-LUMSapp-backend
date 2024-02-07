import { User } from "../models/user.js";
import { Review } from "../models/reviews.js";
import { Instructor } from "../models/instructor.js"; // Import the Instructor model

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

// // Define pre-save middleware on the Review schema to update the instructor's data
// reviewSchema.pre('save', async function(next) {
//   try {
//     // Find the instructor corresponding to the review
//     const instructor = await Instructor.findById(this.instructorID);

//     if (!instructor) {
//       throw new Error('Instructor not found');
//     }

//     // Add the review to the instructor's reviews array
//     instructor.instructorReviews.push(this._id);

//     // Update the review count and rating for the instructor
//     instructor.reviewCount++;
//     instructor.reviewRating = (instructor.reviewRating + this.ratingGiven )/ (instructor.reviewCount);

//     // Save the updated instructor
//     await instructor.save();

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

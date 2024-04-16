import { User } from "../models/user.js";
import { Donation } from "../models/donations.js";

export const getDonations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const donation = await Donation.find();
    console.log("Donations Data:", donation)

    return res.status(200).json({
      success: true,
      message: "Donations retrieved successfully",
      donation,
    });    

  }
  catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}


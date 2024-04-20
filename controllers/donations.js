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
    // console.log("Donations Data:", donation)

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
export const getSpecificDonation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }
    const donation = await Donation.findOne({ _id: req.body.donationID });

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

export const createDonations = async (req, res) => {
  try{
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const newDonation = await Donation.create({
      category: req.body.category,
      details: req.body.donationDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalAmount: req.body.totalAmount,
      pendingAmount: req.body.pendingAmount,
      accountDetails: {
        bank: req.body.bankName,
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        IBAN: req.body.iban,
        issuedBy: req.body.issuingAuthority,
      }
    });

    return res.status(200).json({
      success: true,
      message: "Donation created successfully"
    });
  }  
  catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export const updateDonation = async (req, res) => {
  try{
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not authenticate user",
      });
    }

    const oldDonation = await Donation.findOne({ _id: req.body.donationID });

    if (!oldDonation) {
      return res.status(400).json({
      success: false,
      message: "Donation not found",
      });
    }

    oldDonation.category = req.body.category;
    oldDonation.details = req.body.donationDescription;
    oldDonation.updatedAt = new Date();
    oldDonation.totalAmount = req.body.totalAmount;
    oldDonation.pendingAmount = req.body.pendingAmount;
    oldDonation.accountDetails.bank = req.body.bankName;
    oldDonation.accountDetails.accountName = req.body.accountName;
    oldDonation.accountDetails.accountNumber = req.body.accountNumber;
    oldDonation.accountDetails.IBAN = req.body.iban;
    oldDonation.accountDetails.issuedBy = req.body.issuingAuthority;

    await oldDonation.save();

    return res.status(200).json({
      success: true,
      message: "Donation updated successfully",
    });
  }  
  catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}
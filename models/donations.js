import mongoose from "mongoose";

const donationSchema = mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please enter category name"],
    maxLength: [400, "Category name cannot exceed 200 characters"],
  },
  details: {
    type: String,
    required: [true, "Please enter donation details"],
    maxLength: [2000, "Donation details cannot exceed 2000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  pendingAmount: {
    type: Number,
    required: true,
  },
  accountDetails: {
    bank: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    IBAN: {
      type: String,
      required: false,
    },
    issuedBy: {
      type: String,
      required: true,
    }
  },
});

export const Donation = mongoose.model("Donation", donationSchema);

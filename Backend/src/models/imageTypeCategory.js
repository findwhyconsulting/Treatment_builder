import mongoose from "mongoose";

const imageTypeCategory = new mongoose.Schema(
  {
    bodyType: {
      type: String,
      enum: ["face", "body"], // Ensuring only 'face' or 'body' are valid values
      required: true,
      index: true,
    },
    imagePartCategory: {
      type: String,
      required: true, // Ensuring this field is required
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically update `updatedAt` before save
const imageCategory = mongoose.model("imageTypeCategory", imageTypeCategory);
export default imageCategory;

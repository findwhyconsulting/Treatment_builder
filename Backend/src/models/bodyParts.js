import mongoose from "mongoose";

const bodySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    bodyType: {
      type: String,
      enum: ["face", "body"], // Ensuring only 'face' or 'body' are valid values
      required: true,
      index: true,
    },
    imagePartType: {
      type: String,
      enum: [
        "upperFace",
        "midFace",
        "lowerFace",
        "upperBody",
        "midBody",
        "lowerBody",
      ],
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Ensuring only 'active' or 'inactive' are valid values
      index: true,
      default: "active",
    },
    part: {
      type: String,
      required: true, // You can change this if you want it to be optional
      index: true,
    },
    question: [
      {
        text: {
          type: String,
          required: true,
          index: true,
        },
        packageIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Package",
            index: true,
          },
        ],
      },
    ],

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
const Body = mongoose.model("Bodyparts", bodySchema);
export default Body;

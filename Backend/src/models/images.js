import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    uniqueCode: {
      type: String,
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      index: true,
      // required: true,
    },
    type: {
      type: String,
    },
    dashedLinePositions: {
      upper: { type: Number },
      mid: { type: Number },
    },
    parts: [
      {
        partName: {
          type: String,
          index: true,
        },
        coordinates: {
          x: { type: Number },
          y: { type: Number },
        },
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

const Image = mongoose.model("Image", imageSchema);
export default Image;

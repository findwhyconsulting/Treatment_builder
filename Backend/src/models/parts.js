import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    bodyType: {
      type: String,
      enum: ["face", "body"], // Ensuring only 'face' or 'body' are valid values
      required: true,
      index: true,
    },
    part: {
      type: String,
      required: true, // You can change this if you want it to be optional
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

const Part = mongoose.model("Parts", partSchema);
export default Part;

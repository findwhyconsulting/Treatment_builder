import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Ensuring only 'active' or 'inactive' are valid values
      index: true,
      default: "active",
    },
    amount: {
      // type: Number,
      type: String,
      required: true,
    },
    priorityLevel: {
      type: Number,
      required: true,
    },
    packageNumber: {
      type: String,
    },
    includes: [
      {
        type: String,
        index: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    files: [
      {
        originalName: { type: String },
        savedName: { type: String },
        path: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);
export default Package;

import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
      required: true,
      // unique: true,
    },
    modulePath: {
      type: String,
      required: true,
      // unique: true,
    },
    permissions: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;

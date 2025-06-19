import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      index: true,
      minlength: [2, "First name must be at least 2 characters."],
      maxlength: [50, "First name must be less than 50 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      index: true,
      minlength: [2, "Last name must be at least 2 characters."],
      maxlength: [50, "Last name must be less than 50 characters."],
    },
    clinicName: {
      type: String,
      index: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      index: true,
      // unique: true,
      minlength: [3, "Username must be at least 3 characters."],
      maxlength: [30, "Username must be less than 30 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      // unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format.",
      ],
    },
    mobile: {
      type: Number,
      required: [true, "Mobile number is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters."],
    },
    permissions: [
      {
        moduleName: {
          type: String,
          required: true,
        },
        permissions: {
          create: { type: Boolean, default: false },
          read: { type: Boolean, default: true },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
    role: {
      type: String,
      enum: ["admin", "clinic", "user"],
      // default: "clinic",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      originalName: { type: String },
      savedName: { type: String },
      path: { type: String },
    },
    bio: {
      type: String,
      default: "",
      maxlength: [150, "Bio must be less than 150 characters."],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
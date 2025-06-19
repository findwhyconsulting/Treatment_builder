import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    recommandation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      index: true,
    },
    areasOfConcern: [
      {
        partName: { type: String },
        question: { type: String },
      },
    ],
    selectedImage: {
      type: String,
      ref: "Image",
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      /* In current case kept phone as string as we are saving it with country code too */
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    ageRange: {
      type: String,
      enum: ["18-25", "26-35", "36-45", "46-59", "60+"],
      required: true,
    },
    hadAestheticTreatmentBefore: {
      type: Boolean,
      required: true,
    },
    isConsultationSaved: {
      type: Boolean,
      default: true,
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

const Consultation = mongoose.model("Consultation", consultationSchema);
export default Consultation;

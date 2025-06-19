import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    services: {
      face: {
        type: Boolean,
        default: false,
      },
      body: {
        type: Boolean,
        default: false,
      },
    },
    headingSettings: {
      heading1: {
        type: String,
        index: true,
      },
    },
    step1: {
      heading2: {
        type: String,
        index: true,
      },
      step1Description: {
        type: String,
        index: true,
      },
    },
    step2: {
      heading2: {
        type: String,
        index: true,
      },
      step2Description: {
        type: String,
        index: true,
      },
    },
    step3: {
      heading2: {
        type: String,
        index: true,
      },
      step3Description: {
        type: String,
        index: true,
      },
    },
    step4: {
      heading2: {
        type: String,
        index: true,
      },
      step4Description: {
        type: String,
        index: true,
      },
    },
    buttonSettings: {
      buttonColor: {
        type: String,
        index: true,
      },
      buttonHoverColor: {
        type: String,
        index: true,
      },
      buttonTextColor: {
        type: String,
        index: true,
      },
    },
    stepperSettings: {
      stepperColor: {
        type: String,
        index: true,
      },
    },
    header: {
      headerColor: {
        type: String,
        index: true,
      },
    },
    submitForm: {
      submitDescription: {
        type: String,
        index: true,
      },
      submitTitle: {
        type: String,
        index: true,
      },
    },
    footer: {
      footerColor: {
        type: String,
        index: true,
      },
      footerTextColor: {
        type: String,
        index: true,
      },
      footerCopyRight: {
        type: String,
        index: true,
      },
      privacyPolicy: {
        type: String,
        index: true,
      },
      termsOfService: {
        type: String,
        index: true,
      },
      footerSocialMediaLinks: {
        facebook: { type: String, index: true },
        instagram: { type: String, index: true },
        youtube: { type: String, index: true },
        threads: { type: String, index: true },
        linkedin: { type: String, index: true },
      },
    },
    font: {
      fontFamily: {
        type: String,
        index: true,
      },
    },
    submission: {
      redirectUrl: { type: String, index: true },
    },
    logo: {
      originalName: { type: String },
      savedName: { type: String },
      path: { type: String },
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

const Content = mongoose.model("Content", contentSchema);
export default Content;

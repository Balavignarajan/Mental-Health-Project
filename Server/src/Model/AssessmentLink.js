const mongoose = require("mongoose");

const assessmentLinkSchema = new mongoose.Schema(
  {
    linkToken: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    testId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Test", 
      required: true, 
      index: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    campaignName: { 
      type: String, 
      default: "" 
    },
    expiresAt: { 
      type: Date, 
      default: null 
    },
    maxAttempts: { 
      type: Number, 
      default: null 
    },
    currentAttempts: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    linkType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

const AssessmentLink = mongoose.model("AssessmentLink", assessmentLinkSchema);
module.exports = { AssessmentLink };


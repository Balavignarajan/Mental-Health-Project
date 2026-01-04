const mongoose = require("mongoose");

const emailHistorySchema = new mongoose.Schema(
  {
    assessmentLinkId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "AssessmentLink", 
      required: true,
      index: true
    },
    sentBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
    recipientEmail: { 
      type: String, 
      required: true,
      index: true
    },
    subject: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["sent", "failed"], 
      required: true,
      default: "sent",
      index: true
    },
    errorMessage: { 
      type: String, 
      default: null 
    },
    sentAt: { 
      type: Date, 
      default: Date.now,
      index: true
    },
    customMessage: { 
      type: String, 
      default: "" 
    },
    metadata: { 
      type: Object, 
      default: {} 
    }
  },
  { timestamps: true }
);

// Compound index for efficient queries
emailHistorySchema.index({ assessmentLinkId: 1, sentAt: -1 });
emailHistorySchema.index({ sentBy: 1, sentAt: -1 });

const EmailHistory = mongoose.model("EmailHistory", emailHistorySchema);
module.exports = { EmailHistory };


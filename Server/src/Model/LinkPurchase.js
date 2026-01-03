const mongoose = require("mongoose");

const linkPurchaseSchema = new mongoose.Schema(
  {
    linkToken: { 
      type: String, 
      required: true, 
      index: true 
    },
    assessmentLinkId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "AssessmentLink", 
      required: true, 
      index: true 
    },
    participantEmail: { 
      type: String, 
      required: true, 
      index: true 
    },
    participantName: { 
      type: String, 
      default: "" 
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },

    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" }
  },
  { timestamps: true }
);

const LinkPurchase = mongoose.model("LinkPurchase", linkPurchaseSchema);
module.exports = { LinkPurchase };


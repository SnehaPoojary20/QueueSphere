const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner", // Reference to the Owner model
    required: true,
  },
  businessPhotos: [
    {
      url: { type: String, required: true }, // URL of the photo
      caption: { type: String, trim: true }, // Optional caption/description for the photo
      uploadedAt: { type: Date, default: Date.now }, // Timestamp for when the photo was uploaded
    },
  ],
  businessHours: {
    openingTime: { type: String, required: true }, // e.g., "09:00 AM"
    closingTime: { type: String, required: true }, // e.g., "08:00 PM"
  },
  
  socialLinks: {
    website: { type: String, trim: true }, // Optional website link
    facebook: { type: String, trim: true }, // Optional Facebook link
    instagram: { type: String, trim: true }, // Optional Instagram link
    twitter: { type: String, trim: true }, // Optional Twitter link
  },

  aboutBusiness: {
    type: String,
    trim: true,
    maxlength: 500, // Optional description of the business
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;

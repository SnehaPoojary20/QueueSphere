import express from "express";
import Owner from "../models/Owner.js";
import Profile from "../models/Profile.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Sign-In Function
export const signIn = async (req, res) => {
  try {
    const { name, email, password, phone, businessName, businessCategory, businessLocation } = req.body;

    if (!name || !email || !password || !phone || !businessName || !businessCategory || !businessLocation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) return res.status(400).json({ message: "Owner already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({
      name,
      email,
      password: hashedPassword,
      phone,
      businessName,
      businessCategory,
      businessLocation,
    });

    await newOwner.save();

    const newProfile = new Profile({
        ownerId,
        businessPhotos,
        businessHours,
        socialLinks,
        aboutBusiness,
      });
  
    await newProfile.save();

    return res.json({ message: "Owner Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login Function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(400).json({ message: "Owner does not exist" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await Owner.updateOne({ _id: owner._id }, { token });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Logout Function
export const logout = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const owner = await Owner.findOneAndUpdate({ token }, { token: null });
    if (!owner) {
      return res.status(400).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

 
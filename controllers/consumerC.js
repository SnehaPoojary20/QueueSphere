import Consumer from "../models/Consumer.js"
import bcrypt from "bcrypt";
import crypto from "crypto";

// Sign-In Function

export const signIn = async (req, res) => {
  try {
    const { name, email, password, phone, userId,joinedQueues,createdAt } = req.body;

    if (!name || !email || !password || !phone || !userId ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingConsumer = await Consumer.findOne({ email });
    if (existingConsumer) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newConsumer = new Consumer({
      name,
      email,
      password: hashedPassword,
      phone,
      userId
    });

    await newConsumer.save();

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

    const consumer = await Consumer.findOne({ email });
    if (!consumer) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await Consumer.updateOne({ _id: consumer._id }, { token });

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

    const consumer = await Consumer.findOneAndUpdate({ token }, { token: null });

    if (!consumer) {

      return res.status(400).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {

    return res.status(500).json({ message: error.message });
  }
};

 
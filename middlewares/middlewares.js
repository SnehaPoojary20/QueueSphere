import jwt from "jsonwebtoken";
import Appointment from "../models/Appointment.js";
import Consumer from "../models/Consumer.js";
import Owner from "../models/Owner.js";
import Profile from "../models/Profile.js";
import Queue from "../models/Queue.js";


// For Owner
module.exports.isLoggedInOwner = async (req, res, next) => {
    try {
      // Get token from headers
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
  
      // Find the consumer by token
      const owner = await Owner.findOne({ token });
      if (!owner) {
        return res.status(401).json({ message: "Invalid token or User not logged in" });
      }
  
      // Attach user info to the request object
      req.user = owner;
  
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


// For Consumer
module.exports.isLoggedInUser = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    // Find the consumer by token
    const consumer = await Consumer.findOne({ token });
    if (!consumer) {
      return res.status(401).json({ message: "Invalid token or User not logged in" });
    }

    // Attach user info to the request object
    req.user = consumer;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




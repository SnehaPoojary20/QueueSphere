import Queue from "../models/Queue.js";
import Owner from "../models/Owner.js";
import Consumer from "../models/Consumer.js";
import Appointment from "../models/Appointment.js";

// Book Appointment

export const bookAppointment = async (req, res) => {
  try {
    const { queueId, consumerId, appointmentTime } = req.body;

    if (!queueId || !consumerId || !appointmentTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    if (queue.currentSize >= queue.maxCapacity) {
      return res.status(400).json({ message: "Queue is at maximum capacity" });
    }

    const appointmentNumber = queue.currentSize + 1;

    const appointment = new Appointment({
      consumerId,
      queueId,
      appointmentNumber,
      appointmentTime,
    });

    await appointment.save();

    return res.status(200).json({ message: "Appointement created successfully" });
 
  } catch (error) {

    return res.status(500).json({ message: error.message });
  }
};

// Cancel appointment

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const queue = await Queue.findById(appointment.queueId);

    if (queue) {
      // Remove consumer from the queue
      queue.users = queue.users.filter(

        (user) => user.consumerId.toString() !== appointment.consumerId.toString()

      );

      queue.currentSize -= 1;
      queue.updatedAt = new Date();
      await queue.save();
    }

    await appointment.remove();

    return res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get details

export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("consumerId", "name email phone")
      .populate("queueId", "name location category");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Appointment 

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !["Scheduled", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    appointment.updatedAt = new Date();

    await appointment.save();

    return res.status(200).json({ message: "Appointment status updated", appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

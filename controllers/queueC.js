import Queue from "../models/Queue.js";
import Owner from "../models/Owner.js";
import Consumer from "../models/Consumer.js";
import Appointment from "../models/Appointment.js";


 // Create a New Queue

export const createQueue = async (req, res) => {
  try {
    const { name, businessId, owner, description, category, location, maxCapacity } = req.body;

    if (!name || !businessId || !owner || !category || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newQueue = new Queue({
      name,
      businessId,
      owner,
      description,
      category,
      location,
      maxCapacity: maxCapacity || 50,
    });

    await newQueue.save();

    return res.status(201).json({ message: "Queue created successfully", queue: newQueue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Queue

export const updateQueueStatus = async (req, res) => {
  try {
    const { queueId, status } = req.body;

    if (!["Open", "Closed", "Paused"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'Open', 'Closed', or 'Paused'." });
    }

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.currentStatus = status;
    queue.updatedAt = new Date();

    await queue.save();

    return res.status(200).json({ message: `Queue status updated to ${status}`, queue });

  } catch (error) {

    return res.status(500).json({ message: error.message });
  }
};

// Update waiting time 

export const updateWaitTime = async (req, res) => {
    try {
      const { queueId, averageWaitTime } = req.body;
  
      if (!averageWaitTime || averageWaitTime < 0) {
        return res.status(400).json({ message: "Invalid wait time" });
      }
  
      const queue = await Queue.findById(queueId);
      if (!queue) {
        return res.status(404).json({ message: "Queue not found" });
      }
  
      queue.averageWaitTime = averageWaitTime;
      queue.updatedAt = new Date();
  
      await queue.save();
  
      return res.status(200).json({ message: "Average wait time updated", queue });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  
// Reset Queue 

export const clearQueue = async (req, res) => {
    try {
      const { queueId } = req.body;
  
      const queue = await Queue.findById(queueId);
      if (!queue) {
        return res.status(404).json({ message: "Queue not found" });
      }
  
      queue.users = [];
      queue.currentSize = 0;
      queue.updatedAt = new Date();
  
      await queue.save();
  
      return res.status(200).json({ message: "Queue cleared", queue });
  
    } catch (error) {
  
      return res.status(500).json({ message: error.message });
  
    }
  };
  
  // Delete Queue
  
  export const deleteQueue = async (req, res) => {
      try {
        const { queueId } = req.params;
    
        const queue = await Queue.findById(queueId);
        if (!queue) {
          return res.status(404).json({ message: "Queue not found" });
        }
    
        await queue.remove();
    
        return res.status(200).json({ message: "Queue deleted successfully" });
  
      } catch (error) {
  
        return res.status(500).json({ message: error.message });
      }
    };
  

//Add Consumer

export const addConsumerToQueue = async (req, res) => {
  try {
    const { queueId, consumerId } = req.body;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const consumerExists = await Consumer.findById(consumerId);

    if (!consumerExists) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    if (queue.currentSize >= queue.maxCapacity) {
      return res.status(400).json({ message: "Queue is at maximum capacity" });
    }

    queue.users.push({ consumerId });
    queue.currentSize += 1;
    queue.updatedAt = new Date();

    await queue.save();

    return res.status(200).json({ message: "Consumer added to the queue", queue });

  } catch (error) {

    return res.status(500).json({ message: error.message });

  }
};


// Remove Consumer

export const removeConsumerFromQueue = async (req, res) => {
  try {
    const { queueId, consumerId } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    queue.users = queue.users.filter((user) => user.consumerId.toString() !== consumerId);
    queue.currentSize -= 1;
    queue.updatedAt = new Date();

    await queue.save();

    return res.status(200).json({ message: "Consumer removed from the queue", queue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Get details

export const getQueueDetails = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await Queue.findById(queueId)
      .populate("users.consumerId", "name email")
      .populate("owner", "name phone email");

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    return res.status(200).json({
      queue,
      businessStatus: queue.currentStatus,
      ownerContact: {
        name: queue.owner.name,
        phone: queue.owner.phone,
        email: queue.owner.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


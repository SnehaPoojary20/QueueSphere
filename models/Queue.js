import Owner from "./Owner.js";
import Consumer from "./Consumer.js"
import mongoose from "mongoose";

const queueSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
      },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Owner",
        required:true,
    },
    description:{
        type:String,
        trim:true,
    },
    category: {
        type: String, 
        required: true,
        enum: ['Hospital', 'Store', 'Salon', 'Service', 'Other'], // Restrict categories
    },
    location: {
        type: String, // Address or location details
        required:true
    },
    currentStatus: {
        type: String, // Current queue status
        enum: ['Open', 'Closed', 'Paused'],
        default: 'Closed',
       
    },
    users: [
        {
          consumerId: { 
            type: mongoose.Schema.Types.ObjectId,
             ref: "Consumer"
        },
          joinedAt: { 
            type: Date, 
            default: Date.now
         },
        },
      ],

    averageWaitTime: {
        type: Number, // Average wait time in minutes
        default: 0,
    },

    maxCapacity: {
        type: Number, // Maximum capacity set by the owner
        default: 50,
    },

    currentSize: {
        type: Number, // Tracks current number of users in the queue
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

});

const Queue=mongoose.model("Queue",queueSchema);

module.exports=Queue;
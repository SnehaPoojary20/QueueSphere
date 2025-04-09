import { Router } from "express";
import {createQueue,updateQueueStatus} from "../controllers/queueC.js";
import {bookAppointment,getAppointmentDetails,updateAppointmentStatus,cancelAppointment} from "../controllers/appointmentC.js";
import {isLoggedInOwner, isLoggedInUser} from "../middlewares/middlewares.js";

const router= express.Router({mergeParams:true});
const queueController=require("../controllers/queueC.js");

// Queue will be created by owner of business
router.route("/new-queue").post(isLoggedInOwner, createQueue );

// Queue will be updated by Owner
router.route("/update")
      .put(isLoggedInOwner,updateQueueStatus);

// Queue details can be gained and appointement can be created
router.route("/appointement")
      .post(isLoggedInUser,bookAppointment)
      .get(isLoggedInUser,getAppointmentDetails)
      .put(isLoggedInOwner,updateAppointmentStatus);

// User can cancel his appointement
router.route("/cancel").post(isLoggedInUser, cancelAppointment);

// I want a controller function for owner to check how many users have booked appointement for his business 


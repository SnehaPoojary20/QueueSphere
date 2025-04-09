import express from "express";
import { Router} from "express";
import {isLoggedInUser} from "../middlewares/middlewares.js"

const consumerController=require("../controllers/consumerC.js");

const router= express.Router({mergeParams:true});

// Owner
router.route("/signIn")
      .post(consumerController.signIn);

router.route("/login")
      .post(consumerController.login);

router.route("/logout")
      .post(isLoggedInUser, consumerController.logout);
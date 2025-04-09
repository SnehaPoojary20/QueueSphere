import express from "express";
import { Router} from "express";
import {isLoggedInOwner} from "../middlewares/middlewares.js";
const ownerController=require("../controllers/ownerC.js");


const router= express.Router({mergeParams:true});


router.route("/signIn")
      .post(ownerController.signIn);

router.route("/login")
      .post(ownerController.login);

router.route("/logout")
      .post(isLoggedInOwner,ownerController.logout);

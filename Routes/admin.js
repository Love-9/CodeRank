const express=require("express");
const router=express.Router();
const AdminController=require("../Controller/admin_controller");
const {isLoggedin}=require("../middleware.js");


router.get("/admin", isLoggedin,AdminController.index);
  
router.get("/profile", AdminController.profile);
  
router.get("/mycourses", AdminController.Courses);
  
router.get("/mystudents",AdminController.myStudent);






module.exports=router;
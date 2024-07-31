const express=require('express');
const router=express.Router();
const clientCourse=require('../Controller/Client_Course');


router.get("/",clientCourse.index);

router.get("/:id/details", clientCourse.getDetails);
  
router.post("/:id/details", clientCourse.submitForm);

router.post("/:id/details/payment", clientCourse.renderPaymentPage);
  


module.exports=router;
const Courses=require('../Models/course_listing.js');

module.exports.index=async (req,res)=>{
    const allCourses=await Courses.find({});
    res.render("client.ejs",{allCourses});
}

module.exports.getDetails=async (req, res) => {
    let { id } = req.params;
    const Course = await Courses.findById(id);
    const discountedPrice = Course.discounted_price;
    res.cookie("discountedPrice", discountedPrice, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    let couponName = NaN;
    res.render("Client_next.ejs", { Course, discountedPrice, couponName });
};

module.exports.submitForm=async (req, res) => {
    try {
      const { id } = req.params;
      const Course = await Courses.findById(id);
      const couponName = req.body.Coupon;
      const checkcoup = await Coupons.findOne({ Name: couponName });
  
      if (couponName) {
        if (checkcoup) {
          if (checkcoup.coupon_valid_from > Date.now()) {
            req.flash("error", "Your Coupon can not be accessed");
            return res.redirect(`/${id}/details`);
          }
          if (checkcoup.Coupon_qty <= 0) {
            req.flash("error", "Your Coupon has been exhausted");
            return res.redirect(`/${id}/details`);
          }
  
          const expiryDate = DateTime.fromJSDate(checkcoup.coupon_valid);
          const today = DateTime.now();
  
          if (expiryDate <= today) {
            req.flash("error", "Coupon has Expired");
            return res.redirect(`/${id}/details`);
          }
  
          if (!checkcoup.course.includes(id)) {
            req.flash("error", "Your Coupon is not Associated With this Course");
            return res.redirect(`/${id}/details`);
          }
        }
  
        const Coupon = await Coupons.findOne({ Name: couponName });
        if (!Coupon) {
          req.flash("error", "Invalid Coupon Name");
          return res.redirect(`/${id}/details`);
        }
  
        const discountedPrice =
          (1 - Coupon.Discount / 100) * Course.discounted_price;
  
        res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("discountedPrice", discountedPrice, {
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        return res.render("Client_next.ejs", {
          Course,
          discountedPrice, // Pass discountedPrice
          couponName,
          error: null, // Pass null for error
        });
      } else {
        const discountedPrice = Course.discounted_price;
  
        res.cookie("coupon", couponName, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("discountedPrice", discountedPrice, {
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        return res.render("Client_next.ejs", {
          Course,
          discountedPrice, // Pass discountedPrice
          couponName,
          error: null, // Pass null for error
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      res.status(500).send("Internal Server Error");
    }
 }

 module.exports.renderPaymentPage=(req, res) => {
    res.render("checkout.ejs");
  }








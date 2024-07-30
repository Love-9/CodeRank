const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejsmate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const CourseRouter = require("./Routes/Courses.js");
const clientRouter = require("./Routes/Client.js");
const CouponRouter = require("./Routes/Coupons.js");
const AdminRouter=require('./Routes/admin.js');
const { DateTime } = require("luxon");
const flash = require("connect-flash");
const User = require("./Models/User.js");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const LocalStrategy=require('passport-local');
const session=require('express-session');
const userRouter=require('./Routes/user.js');
// const PaytmChecksum = require("./PaytmChecksum");
app.use(express.static("./assets"));
app.use(
  "/assets",
  express.static("assets", {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "text/javascript");
      }
    },
  })
);

const sessionOptions={
  secret:"MySecret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
const corsOptions = {
  origin: "*",
  credentials: true,
};
//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/Assets_copy", express.static(path.join(__dirname, "Assets_copy")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors(corsOptions));
app.use(cookieParser());
dotenv.config({ path: "./config.env" });
const MONGO_URL = process.env.MONGOURL;
main()
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Routing 
app.use("/admin",CourseRouter,CouponRouter ,AdminRouter);
app.use("/", clientRouter);
app.use("/",userRouter);





// app.post("/:id/details/payment", async (req, res) => {
//   try {
//     // Create a new student
//     const student = new Student(req.body.Student);
//     const savedStudent = await student.save();

//     // Retrieve the coupon name from the cookie
//     const couponName = req.cookies.coupon;
//     const discountedPrice = req.cookies.discountedPrice;

//     // Find and decrement the coupon quantity
//     const updatedCoupon = await Coupons.findOneAndUpdate(
//       { Name: couponName },
//       { $inc: { Coupon_qty: -1 } }, // Decrement the count by 1
//       { new: true } // Return the updated document
//     );

//     // Update admin earnings
//     const updatedAdmin = await Admin.findOneAndUpdate(
//       {},
//       {
//         $inc: { earnings: discountedPrice },
//         $push: { students: savedStudent._id },
//       }, // Push the student's ID to the students array
//       { new: true }
//     );

//     // Render checkout page
//     res.render("checkout.ejs");
//   } catch (error) {
//     // Handle error
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Define function to create HTML email content with dynamic values
function generateEmailContent(amount, name, mobileNumber, coupon) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        h2 {
          color: #333;
        }
        p {
          margin: 10px 0;
        }
        .invoice-info {
          margin-top: 20px;
          background-color: #fff;
          padding: 15px;
          border-radius: 8px;
        }
        .invoice-info p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Invoice</h2>
        <p>Dear ${name},</p>
        <p>We're pleased to inform you that your invoice has been generated successfully:</p>
        <div class="invoice-info">
          <p>Amount: ${amount}</p>
          <p>Name: ${name}</p>
          <p>Mobile Number: ${mobileNumber}</p>
          <p>Coupon: ${coupon}</p>
          <!-- Add more invoice details as needed -->
        </div>
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;
}

app.get("/sendmail",(req,res)=>{
  let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "info@coderank.in", // your email address
                  pass: "Support@0152@", // your email password
                },
              });
    
              // Setup email data
              let mailOptions = {
                from: '"Your Company" <info@coderank.in>', // sender address
                to: "malujalove9@gmail.com", // recipient address
                subject: "Invoice Notification", // Subject line
                html:"<h1>Hi</h1>"
              };
    
              // Send email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log("Error sending email:", error);
                  // res.status(500).send("Failed to send email");
                } else {
                  console.log("Email sent:", info.response);
                  // res.status(200).send("Email sent successfully");
                }
              });
            }

)


// function generateUniqueOrderId() {
//   const timestamp = Date.now(); // Current timestamp in milliseconds
//   const randomPart = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
//   return `order_${timestamp}_${randomPart}`;
// }

// const orderId = generateUniqueOrderId();
// app.post("/pay", async (req, res) => {
//   // Create a new student
//   const student = new Student(req.body.Student);
//   const savedStudent = await student.save();

//   // Retrieve the coupon name from the cookie
//   const couponName = req.cookies.coupon;
//   const discountedPrice = req.cookies.discountedPrice;

//   // Find and decrement the coupon quantity
//   const updatedCoupon = await Coupons.findOneAndUpdate(
//     { Name: couponName },
//     { $inc: { Coupon_qty: -1 } }, // Decrement the count by 1
//     { new: true } // Return the updated document
//   );

//   // Update admin earnings
//   const updatedAdmin = await Admin.findOneAndUpdate(
//     {},
//     {
//       $inc: { earnings: discountedPrice },
//       $push: { students: savedStudent._id },
//     }, // Push the student's ID to the students array
//     { new: true }
//   );

//   var paytmParams = {};
//   paytmParams.body = {
//     requestType: "Payment",
//     mid: Config.MID,
//     websiteName: Config.WEBSITE,
//     orderId: orderId,
//     callbackUrl: "http://localhost:3000/txnstatus",
//     txnAmount: {
//       value: req.cookies.discountedPrice,
//       currency: "INR",
//     },
//     userInfo: {
//       custId: "CUST_001",
//     },
//   };

//   PaytmChecksum.generateSignature(
//     JSON.stringify(paytmParams.body),
//     Config.MKEY
//   ).then(function (checksum) {
//     paytmParams.head = {
//       signature: checksum,
//     };

//     var post_data = JSON.stringify(paytmParams);
//     console.log(post_data);

//     var options = {
//       /* for Staging */
//       hostname: Config.ENV,
//       port: 443,
//       path:
//         "/theia/api/v1/initiateTransaction?mid=" +
//         Config.MID +
//         "&orderId=" +
//         orderId,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": post_data.length,
//       },
//     };

//     var response = "";
//     var post_req = https.request(options, function (post_res) {
//       post_res.on("data", function (chunk) {
//         response += chunk;
//       });
//       var obj = {};
//       post_res.on("end", function () {
//         var obj = JSON.parse(response);
//         var data = {
//           env: Config.ENV,
//           mid: Config.MID,
//           amount: 1,
//           orderid: orderId,
//           txntoken: obj.body.txnToken,
//           value: paytmParams.body.txnAmount.value,
//         };

//         res.render("index.ejs", { data: data });
//       });
//     });
//     post_req.write(post_data);
//     post_req.end();
//   });
// });

// app.post("/callback", (req, res) => {
//   let body = "";
//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   console.log(body);
//   req.on("end", () => {
//     var postbodyjson = parse(body);
//     postbodyjson = JSON.parse(JSON.stringify(postbodyjson));
//     console.log(postbodyjson);

//     var checksum = postbodyjson.CHECKSUMHASH;
//     delete postbodyjson["CHECKSUMHASH"];

//     var verifyChecksum = PaytmChecksum.verifySignature(
//       postbodyjson,
//       Config.MKEY,
//       checksum
//     );
//     if (verifyChecksum) {
//       res.render("callback.ejs", {
//         verifySignature: "true",
//         data: postbodyjson,
//       });
//       // res.redirect("/txnstatus");
//     } else {
//       res.render("callback.ejs", {
//         verifySignature: "false",
//         data: postbodyjson,
//       });
//     }
//   });
// });

// app.post("/txnstatus", async (req, res) => {
//   var paytmParams = {};

//   /* body parameters */
//   paytmParams.body = {
//     mid: Config.MID,
//     /* Enter your order id which needs to be check status for */
//     orderId: orderId,
//   };
//   PaytmChecksum.generateSignature(
//     JSON.stringify(paytmParams.body),
//     Config.MKEY
//   ).then(function (checksum) {
//     /* head parameters */
//     paytmParams.head = {
//       signature: checksum,
//     };
//     /* prepare JSON string for request */
//     var post_data = JSON.stringify(paytmParams);

//     var options = {
//       hostname: Config.ENV,
//       port: 443,
//       path: "/v3/order/status",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": post_data.length,
//       },
//     };
//     var response = "";
//     var post_req = https.request(options, function (post_res) {
//       post_res.on("data", function (chunk) {
//         response += chunk;
//       });

//       post_res.on("end", function () {
//         var obj = JSON.parse(response);
//         // req.expressSession.msg = obj.body.resultInfo.resultMsg;
//         if (obj.body.resultInfo.resultStatus === "TXN_SUCCESS") {
//           // Retrieve user's details from cookies
//           const amount = req.cookies.discountedPrice || "N/A";
//           const name = req.cookies.name || "N/A";
//           const mobileNumber = req.cookies.mobile || "N/A";
//           const coupon = req.cookies.coupon || "N/A";
//           // Check for msg in session
//           const msg = req.session.msg || null;
//           delete req.session.msg; // Clear the message after reading it

//           // Create a transporter object using the default SMTP transport
//           let transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//               user: "manan27bhasin@gmail.com", // your email address
//               pass: "nzsg lien pykp bywr", // your email password
//             },
//           });

//           // Setup email data
//           let mailOptions = {
//             from: '"Your Company" <sender@example.com>', // sender address
//             to: `${req.cookies.email}`, // recipient address
//             subject: "Invoice Notification", // Subject line
//             html: generateEmailContent(amount, name, mobileNumber, coupon), // HTML email content with dynamic values
//           };

//           // Send email
//           transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//               console.log("Error sending email:", error);
//               // res.status(500).send("Failed to send email");
//             } else {
//               console.log("Email sent:", info.response);
//               // res.status(200).send("Email sent successfully");
//             }
//           });
//         }
//         res.render("txnstatus.ejs", {
//           data: obj.body,
//           msg: obj.body.resultInfo.resultMsg,
//         });
//       });
//     });

//     post_req.write(post_data);
//     post_req.end();
//   });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App is listening to port");
});

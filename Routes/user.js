const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../Controller/user_controller.js');
router.get("/login", userController.renderLogin);
router.get("/signup",userController.renderSignup);
router.post("/signup",userController.signUp);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect(user.role === 'admin' ? '/admin' : '/');
      });
    })(req, res, next);
  });
  
router.get("/logout", userController.logOut);
module.exports=router;
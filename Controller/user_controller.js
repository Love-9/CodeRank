const User=require('../Models/User.js');
module.exports.renderLogin=async (req, res) => {
    res.render("login");
}

module.exports.renderSignup=(req,res)=>{
    res.render("signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    await User.register(newUser,password);
}

module.exports.logOut=(req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
}

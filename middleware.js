module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log("please loggine");
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}
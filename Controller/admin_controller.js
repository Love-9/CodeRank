const Admin=require('../Models/admin');
const Courses=require('../Models/course_listing');

module.exports.index=async (req, res) => {
    const admin = await Admin.findOne({});
    res.render("dashboard.ejs", { admin });
}

module.exports.profile=(req, res) => {
    res.render("profile.ejs");
}

module.exports.Courses=async (req, res) => {
    let allCourses = await Courses.find({});
    res.render("mycourses.ejs", { allCourses });
}

module.exports.myStudent= async (req, res) => {
    try {
      
      const admin = await Admin.findOne({});
        await admin.populate("students");
  
      const allStudents = admin.students.map((student) => {
        return {
          name: student.name,
          email: student.email,
          year: student.year,
          coursename: student.coursename,
          createdAt: student.createdAt,
          mobile: student.mobile,
        };
      });
      res.render("mystudents.ejs", { allStudents });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
}

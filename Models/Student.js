const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  Registered: [
    {
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  year: {
    type: Number,
    require: true,
  },
  coursename: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);

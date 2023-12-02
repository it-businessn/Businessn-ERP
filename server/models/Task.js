const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  status: String,
  name: String,
  dueDate: Date,
  date: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

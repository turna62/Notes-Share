const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
  
  title: String,
  user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
  },
  description: String,  
  icon: String, 
  images: [String], 
  audios: [String],  
  
});

module.exports = mongoose.model("ToDo", ToDoSchema);
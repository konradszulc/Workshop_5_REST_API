const mongoose = require('mongoose');

//A mongoose Schema for Post Model
const postSchema = new mongoose.Schema(
  {
    title: { type: String, Required: true, Trim: true },
    content: { type: String, Required: true, Trim: true },
    author: { type: String, Required: true, trim: true }
  },
  {
    // this adds createAt and updatedAT fields to the schema
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
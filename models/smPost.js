const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smPost = new Schema({
  icon: { type: String, required: false },
  sayer: { type: String, required: false },
  content: { type: String, required: true },
  lang: { type: String, required: true },
});

const SmPost = mongoose.model("smposts", smPost);

module.exports = SmPost;

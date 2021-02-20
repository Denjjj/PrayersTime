const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSectionSchema = new Schema({
  title: { type: String, required: true },
  type: { type: Number, required: true },
  lang: { type: String, required: true },
});

const PostSection = mongoose.model("posts-sections", postSectionSchema);

module.exports = PostSection;

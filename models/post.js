const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: Number, required: true },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    postSection: { type: String, required: false },
    postCount: { type: Number, required: false },
    lang: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", PostSchema);

module.exports = Post;

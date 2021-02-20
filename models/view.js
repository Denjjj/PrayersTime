const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const viewSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  view: {
    type: String,
    required: true,
  },
  type: { type: String, required: true },
  ip: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
});

const View = mongoose.model("views", viewSchema);

module.exports = View;

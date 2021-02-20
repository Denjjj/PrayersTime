const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  siteTitle: {
    type: String,
    required: true,
  },
  siteDesc: {
    type: String,
    required: true,
  },
  siteKeywords: {
    type: String,
    required: true,
  },
  siteEmail: {
    type: String,
    required: true,
  },
  logoDist: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
});

const settings = mongoose.model("settings", settingsSchema);

module.exports = settings;

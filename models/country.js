const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  countryCode: { type: String, required: true },
  en_name: { type: String, required: true },
  ar_name: { type: String, required: true },
  flagFullName: { type: String, required: true },
});

const Country = mongoose.model("coutries", countrySchema);

module.exports = Country;

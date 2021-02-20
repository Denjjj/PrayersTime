const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema({
  countryCode: { type: String, required: true },
  en_name: { type: String, required: true },
  ar_name: { type: String, required: true },
});

const City = mongoose.model("cities", citySchema);

module.exports = City;

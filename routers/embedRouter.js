const express = require("express");
const settings = require("../models/settings.js");
const City = require("../models/city.js");
const pkg = require("country-list");
const { getCode, getName } = pkg;

const router = express.Router();

router.get("/embed/:city/:country", (req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((settingResults) => {
      let cityName = req.params.city,
        countryName = req.params.country;
      let params = JSON.stringify({
        cityName,
        countryName,
      });
      res.render("embed/embed", {
        title: "تضمين",
        getLocation: "null",
        params,
        cityName,
        countryName,
        siteTitle: settingResults.siteTitle,
        desc: settingResults.siteDesc,
        email: settingResults.siteEmail,
        logoDist: settingResults.logoDist,
        keyword: settingResults.siteKeywords,
        lang: langQuery,
      });
    });
});

router.get(
  "/widget/:school/:juristic/:timeformat/:city/:country",
  (req, res) => {
    let langQuery = req.query.lang || "ar";

    settings
      .find({ lang: langQuery })
      .then((results) => results[0])
      .then((settingResults) => {
        let school = req.params.school,
          juristic = req.params.juristic,
          timeformat = req.params.timeformat,
          cityName = req.params.city,
          countryName = req.params.country,
          iframetype = req.params.iframetype,
          countryCode = getCode(countryName);

        let params = JSON.stringify({
          school,
          juristic,
          timeformat,
          cityName,
          countryName,
          lang: langQuery,
          iframetype,
        });

        City.find({
          en_name: cityName.replace(/-/g, " "),
          countryCode,
        }).then((cityResults) => {
          let cityLocaleName = cityName;

          if (cityResults[0] != undefined) {
            cityLocaleName =
              langQuery == "en"
                ? cityResults[0].en_name
                : cityResults[0].ar_name;
          }

          res.render("embed/widget", {
            title: "تضمين - Embed",
            params: params,
            getLocation: "null",
            cityName,
            countryName,
            cityLocaleName,
            siteTitle: settingResults.siteTitle,
            desc: settingResults.siteDesc,
            email: settingResults.siteEmail,
            logoDist: settingResults.logoDist,
            keyword: settingResults.siteKeywords,
            lang: langQuery,
          });
        });
      });
  }
);

router.get(
  "/widget-long/:school/:juristic/:timeformat/:city/:country",
  (req, res) => {
    let langQuery = req.query.lang || "ar";

    settings
      .find({ lang: langQuery })
      .then((results) => results[0])
      .then((settingResults) => {
        let school = req.params.school,
          juristic = req.params.juristic,
          timeformat = req.params.timeformat,
          cityName = req.params.city,
          countryName = req.params.country,
          iframetype = req.params.iframetype,
          countryCode = getCode(countryName);

        let params = JSON.stringify({
          school,
          juristic,
          timeformat,
          cityName,
          countryName,
          lang: langQuery,
          iframetype,
        });

        City.find({
          en_name: cityName.replace(/-/g, " "),
          countryCode,
        }).then((cityResults) => {
          let cityLocaleName = cityName;

          if (cityResults[0] != undefined) {
            cityLocaleName =
              langQuery == "en"
                ? cityResults[0].en_name
                : cityResults[0].ar_name;
          }

          res.render("embed/widget-long", {
            title: "تضمين - Embed",
            params: params,
            siteTitle: settingResults.siteTitle,
            cityName,
            countryName,
            cityLocaleName,
            desc: settingResults.siteDesc,
            email: settingResults.siteEmail,
            logoDist: settingResults.logoDist,
            keyword: settingResults.siteKeywords,
            getLocation: "null",
            lang: langQuery,
          });
        });
      });
  }
);

module.exports = router;

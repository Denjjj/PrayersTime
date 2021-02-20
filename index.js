require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const fetch = require("node-fetch");
const settings = require("./models/settings.js");
const View = require("./models/view.js");
const City = require("./models/city.js");
const Country = require("./models/country.js");
const pkg = require("country-list");
const countrypkg = require("country-code-lookup");
const { byIso, byCountry } = countrypkg;
const countrytwopkg = require("country-codes-list");
const { customList } = countrytwopkg;
const { getCode, getName } = pkg;
const embedRouter = require("./routers/embedRouter.js");
const adminRouter = require("./routers/adminRouter.js");
const postsRouter = require("./routers/postsRouter.js");
const Post = require("./models/post.js");
const session = require("cookie-session");
const geopkg = require("geoip-lite");
const { lookup } = geopkg;
const requestIp = require("request-ip");

const app = express();

// MongoDB

const url = `mongodb+srv://aanpc:Zalamoka@prayes.vqnds.mongodb.net/prayes-site?retryWrites=true&w=majority`,
  port = process.env.PORT || 3000;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected To PraySite DB");
    app.listen(port);
  })
  .catch(() => {
    console.log("Failed To Connect To PraySite DB");
  });

// End MongoDB

// View Engine

app.set("view engine", "ejs");

// End View Engine

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Get User Data
let userData = {},
  userIp = "",
  backUserData = {},
  userDataFunc = (req, res, next) => {
    app.use(function (req, res) {
      const ip = req.clientIp;
      res.end(ip);

      if (ip == "::1" || ip == "::ffff:127.0.0.1") {
        ip = "45.242.76.121";
      }

      let countryCode = lookup(ip).country,
        cityName = lookup(ip).city,
        lati = lookup(ip).ll[0],
        long = lookup(ip).ll[1],
        capitalCity = lookup(ip).timezone.split("/")[1];

      userData = {
        ipAddress: ip,
        countryCode: countryCode,
        countryName: getName(countryCode),
        cityName: cityName,
        longitude: long,
        latitude: lati,
        capitalCity,
      };
      backUserData = userData;
      userData = JSON.stringify(userData);
      userIp = ip;
    });
    next();
  };

app.use(userDataFunc);

// Render Home Page
app.get("/detect", (req, res) => {
  let langQuery = req.query.lang || "ar";

  if (backUserData.cityName != "") {
    if (langQuery == "en") {
      res.redirect(
        `/${backUserData.countryName}/${backUserData.cityName}?lang=en`
      );
    } else {
      res.redirect(`/${backUserData.countryName}/${backUserData.cityName}`);
    }
  } else {
    backUserData.cityName = backUserData.capitalCity;

    if (langQuery == "en") {
      res.redirect(
        `/${backUserData.countryName}/${backUserData.cityName}?lang=en`
      );
    } else {
      res.redirect(`/${backUserData.countryName}/${backUserData.cityName}`);
    }
  }
});

// Render Home Page
app.get("/", (req, res) => {
  let langQuery = req.query.lang || "ar",
    countryQuery = parseInt(req.query.c) || 0,
    endCountryQuery = countryQuery + 18;

  Country.find().then((countryResults) => {
    let countryLocaleName =
      langQuery == "en" ? countryResults[0].en_name : countryResults[0].ar_name;

    let countries = countryResults,
      countriesArray = [];

    for (let i = countryQuery; i < endCountryQuery; i++) {
      let country = Object.values(countries)[i];

      if (Object.values(countries)[i] == undefined) {
        countriesArray = [];
        break;
      } else {
        countriesArray[i] = country;
      }
    }

    settings
      .find({ lang: langQuery })
      .then((results) => results[0])
      .then((results) => {
        res.render("index-country", {
          lang: langQuery,
          title: results.siteTitle,
          desc: results.siteDesc,
          email: results.siteEmail,
          logoDist: results.logoDist,
          cityName: backUserData.cityName,
          countryName: backUserData.countryName,
          countryLocaleName,
          countries: countriesArray,
          endCountryQuery,
          keyword: results.siteKeywords,
          getLocation: "null",
        });
      });
  });
});

// Json Countries & Cities

app.get("/cco", (req, res) => {
  Country.find().then((results) => {
    res.json(results);
    res.send(results);
  });
});

app.get("/cct/:cName", (req, res) => {
  let cName =
      getCode(req.params.cName) ||
      customList(req.params.cName)["iso2"] ||
      lookup(req.params.cName),
    searchQuery = req.query.search,
    langQuery = req.query.lang;

  if (req.params.cName == "all" && searchQuery.length > 0) {
    let theLangSearch = "ar_name";

    if (langQuery == "en") {
      theLangSearch = "en_name";
    }

    City.find({
      [theLangSearch]: { $regex: searchQuery, $options: "mi" },
    }).then((results) => {
      let data = [];

      Object.values(results).forEach((results) => {
        data.push(results);
      });

      data.reverse();

      res.json(data);
      res.send(data);
    });
  } else {
    if (getCode(req.params.cName) == null) {
      if (customList(req.params.cName) != undefined) {
        cName = customList(req.params.cName)["iso2"];
      } else {
        cName = lookup(req.params.cName);
      }
    } else {
      cName = getCode(req.params.cName);
    }

    City.find({ countryCode: cName }).then((results) => {
      res.json(results);
      res.send(results);
    });
  }
});

app.get("/ccd/:code", (req, res) => {
  let code = req.params.code.toUpperCase();

  Country.find({
    countryCode: { $regex: code, $options: "$i" },
  }).then((results) => {
    res.json(results);
    res.send(results);
  });
});

// Admin Router
app.use(adminRouter);

// Posts Router
app.use(postsRouter);

// Country Cities
app.get("/country/:countryName", (req, res) => {
  let langQuery = req.query.lang || "ar",
    countryName = req.params.countryName;

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((results) => {
      Country.find({ en_name: countryName }).then((countryResults) => {
        City.find({ countryCode: countryResults[0].countryCode }).then(
          (citiesResults) => {
            let title =
                langQuery == "en"
                  ? `${countryResults[0].en_name} Cities`
                  : `مدن ${countryResults[0].ar_name}`,
              countryLocalName =
                langQuery == "en"
                  ? `${countryResults[0].en_name}`
                  : `${countryResults[0].ar_name}`;

            res.render("country", {
              lang: langQuery,
              desc: results.siteDesc,
              email: results.siteEmail,
              logoDist: results.logoDist,
              keyword: results.siteKeywords,
              getLocation: "null",
              title: results.siteTitle,
              heading: title,
              errMsg: "",
              countryLocalName,
              countryEnName: countryResults[0].en_name,
              countryCode: countryResults[0].countryCode,
              cities: citiesResults,
            });
          }
        );
      });
    });
});

// Show City Data
app.get("/:countryname/:cityname", (req, res) => {
  let langQuery = req.query.lang || "ar",
    cityName = req.params.cityname.toString().replace(/ /g, "-"),
    countryName = req.params.countryname.toString(),
    countryCode = getCode(countryName),
    url = `/${cityName}/${countryName}`;

  Country.find({ en_name: countryName }).then((countryResults) => {
    if (countryResults.length != 0) {
      let countryLocaleName =
        langQuery == "en"
          ? countryResults[0].en_name
          : countryResults[0].ar_name;

      City.find({ countryCode: countryResults[0].countryCode }).then(
        (allcities) => {
          City.find({
            en_name: cityName.replace(/-/g, " "),
            countryCode: countryResults[0].countryCode,
          }).then((cityResults) => {
            let cityLocaleName = cityName;

            if (cityResults[0] != undefined) {
              cityLocaleName =
                langQuery == "en"
                  ? cityResults[0].en_name
                  : cityResults[0].ar_name;
            }

            userData = { cityName, countryName, countryCode };

            let view = new View({
              url: url,
              view: 1,
              type: "city",
              ip: userIp,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
              day: new Date().getDay(),
              lang: langQuery,
            });

            View.find({ ip: userIp, day: new Date().getDay() }).then(
              (result) => {
                if (result.length < 1) {
                  view.save();
                }
              }
            );

            settings
              .find({ lang: langQuery })
              .then((results) => results[0])
              .then((results) => {
                console.log("AAAAAAAAAAAAAAAAA");

                res.render("city", {
                  lang: langQuery,
                  title: results.siteTitle,
                  desc: results.siteDesc,
                  email: results.siteEmail,
                  logoDist: results.logoDist,
                  cityName,
                  countryName,
                  countryLocaleName,
                  cityLocaleName,
                  allcities,
                  keyword: results.siteKeywords,
                  getLocation: userData,
                });
              });
          });
        }
      );
    } else {
      res.redirect("/404");
    }
  });
});

// Show Month Data
app.get("/month/:countryname/:cityname", (req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((results) => {
      let cityName = req.params.cityname
          .toString()
          .toLowerCase()
          .replace(/ /g, "-"),
        countryName = req.params.countryname.toString().toLowerCase(),
        countryCode = getCode(countryName),
        url = `/${cityName}/${countryName}`;

      countryName == "admin" ? res.redirect("/admin/login") : "";

      userData = { cityName, countryName, countryCode };

      let view = new View({
        url: url,
        view: 1,
        type: "city",
        ip: userIp,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        day: new Date().getDay(),
        lang: langQuery,
      });

      View.find({ ip: userIp, day: new Date().getDay() }).then((result) => {
        if (result.length < 1) {
          view.save();
        }
      });

      res.render("month-prayes", {
        lang: langQuery,
        title: results.siteTitle,
        desc: results.siteDesc,
        email: results.siteEmail,
        logoDist: results.logoDist,
        keyword: results.siteKeywords,
        countryName,
        cityName,
        getLocation: "null",
      });
    });
});

// Embed Router
app.use(embedRouter);

// Dhuha
app.get("/dhuha/:countryname/:cityname", (req, res) => {
  let langQuery = req.query.lang || "ar";

  // Get User Data
  let backUserData = {};
  let locationApiKey = `20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e`;
  fetch(`http://api.ipinfodb.com/v3/ip-city/?key=${locationApiKey}&format=json`)
    .then((res) => res.json())
    .then((json) => {
      backUserData = { ...json };

      let cityName = req.params.cityname,
        countryName = req.params.countryname;

      settings
        .find({ lang: langQuery })
        .then((results) => results[0])
        .then((results) => {
          Post.find({ postcustom: "duha", lang: langQuery }).then(
            (duhaResults) => {
              res.render("dhuha", {
                lang: langQuery,
                title: results.siteTitle,
                siteTitle: results.siteTitle,
                desc: results.siteDesc,
                cityName,
                countryName,
                content: duhaResults[0],
                email: results.siteEmail,
                logoDist: results.logoDist,
                keyword: results.siteKeywords,
                getLocation: userData,
              });
            }
          );
        });
    });
});

// Istikharah
app.get("/istikharah/:countryname/:cityname", (req, res) => {
  let langQuery = req.query.lang || "ar";

  // Get User Data
  let backUserData = {};
  let locationApiKey = `20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e`;
  fetch(`http://api.ipinfodb.com/v3/ip-city/?key=${locationApiKey}&format=json`)
    .then((res) => res.json())
    .then((json) => {
      backUserData = { ...json };

      let cityName = req.params.cityname,
        countryName = req.params.countryname;

      settings
        .find({ lang: langQuery })
        .then((results) => results[0])
        .then((results) => {
          Post.find({ postcustom: "istikharah", lang: langQuery }).then(
            (istikharahResults) => {
              res.render("istikharah", {
                lang: langQuery,
                title: results.siteTitle,
                siteTitle: results.siteTitle,
                desc: results.siteDesc,
                cityName,
                countryName,
                content: istikharahResults[0],
                email: results.siteEmail,
                logoDist: results.logoDist,
                keyword: results.siteKeywords,
                getLocation: userData,
              });
            }
          );
        });
    });
});

app.use((req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((results) => {
      res.status(404).render("404", {
        lang: langQuery,
        title: results.siteTitle,
        desc: results.siteDesc,
        email: results.siteEmail,
        logoDist: results.logoDist,
        keyword: results.siteKeywords,
        getLocation: "null",
      });
    });
});

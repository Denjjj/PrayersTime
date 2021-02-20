const pkg = require("password-hash");
const { generate, verify } = pkg;
const User = require("../models/user.js");
const mongoose = require("mongoose");
const { isLogged, isAdmin } = require("./adminController.js");
const session = require("cookie-session");
const City = require("../models/city.js");
const Country = require("../models/country.js");

const strip_tags = (inp) => {
  return inp.replace(/(<([^>]+)>)/gi, "");
};

const showUsers = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    User.find().then((result) => {
      res.render("admin/users", {
        title: "الأعضاء",
        users: result,
      });
    });
  }
};

const showUserForm = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    res.render("admin/add-user", {
      title: `اضافة عضو`,
      errMsg: "",
    });
  }
};

const addUserData = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let userName = strip_tags(req.body.user_name),
      userMail = strip_tags(req.body.user_mail),
      userPassword = strip_tags(req.body.user_password),
      userRole = strip_tags(req.body.user_role);

    userPassword = generate(userPassword);

    if (
      userName.length == 0 ||
      userMail.length == 0 ||
      userPassword.length == 0 ||
      userRole.length == 0
    ) {
      res.render("admin/add-user", {
        title: `اضافة عضو`,
        errMsg: "برجاء مليئ جميع الحقول التالية",
      });
    } else {
      let user = new User({
        username: userName,
        role: userRole,
        email: userMail,
        password: userPassword,
      });

      user.save();

      res.render("admin/add-user", {
        title: `اضافة عضو`,
        errMsg: "تم اضافة العضو بنجاح",
      });
    }
  }
};

const editUserForm = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let userId = strip_tags(req.params.userId);

    User.find({ _id: userId }).then((results) => {
      let { username, role, email, password } = results[0],
        userData = { username, role, email, password };

      res.render("admin/edit-user", {
        title: `تعديل عضو`,
        errMsg: "",
        userId,
        userData,
      });
    });
  }
};

const editUserData = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let userId = strip_tags(req.params.userId);

    let { user_name, user_role, user_mail } = req.body,
      userData = { username: user_name, role: user_role, email: user_mail };

    User.updateOne({ _id: userId }, { $set: userData }).then(() => {
      res.render("admin/edit-user", {
        title: `تعديل عضو`,
        errMsg: "تم تعديل البيانات",
        userId,
        userData,
      });
    });
  }
};

const deleteUser = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let userId = req.params.userId;

    User.deleteOne({ _id: userId }).then(() => {
      console.log("Deleted");
      res.redirect(`/admin/users`);
    });
  }
};

const showCountries = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let userId = req.params.userId;

    Country.find().then((result) => {
      let arr = [],
        countries;

      for (let i = 0; i < Object.keys(result).length; i++) {
        arr.push(Object.values(result)[i]);
      }

      countries = arr;

      res.render("admin/countries", {
        title: `البلدان`,
        errMsg: "",
        userId,
        countries: arr,
      });
    });
  }
};

const showAddCountryForm = (req, res) => {
  isLogged(req, res);
  res.render("admin/add-country", {
    title: `اضافة بلد`,
    errMsg: "",
  });
};

const addAddCountryData = (req, res) => {
  isLogged(req, res);
  let countryCode = strip_tags(req.body.country_code),
    countryArName = strip_tags(req.body.country_ar_name),
    countryEnName = strip_tags(req.body.country_en_name);

  if (
    countryCode.length <= 0 ||
    countryArName.length <= 0 ||
    countryEnName.length <= 0
  ) {
    res.render("admin/add-country", {
      title: `اضافة بلد`,
      errMsg: `برجاء ملئ جميع الحقول التالية لإضافة البلد`,
    });
  } else {
    let imageNameWithExt = `${countryCode}.svg`;
    if (req.files != undefined || req.files != null) {
      let imgFile = req.files.countryFlag,
        countryName = countryCode.toLowerCase(),
        imgFileExt = req.files.countryFlag.name.split(".")[
          imgFile.name.split(".").length - 1
        ];

      imgFile.mv(`./public/assets/flags/${countryName}.${imgFileExt}`);
      imageNameWithExt = `${countryName}.${imgFileExt}`;
    }
    let country = new Country({
      countryCode,
      ar_name: countryArName,
      en_name: countryEnName,
      flagFullName: imageNameWithExt,
    });

    country.save();

    res.render("admin/add-country", {
      title: `اضافة بلد`,
      errMsg: `تم الاضافة بنجاح`,
    });
  }
};

const showCountryData = (req, res) => {
  isLogged(req, res);

  let countryCode = req.params.countryCode;

  Country.find({ countryCode: countryCode }).then((countryResults) => {
    City.find({ countryCode: countryResults[0].countryCode }).then(
      (citiesResults) => {
        res.render("admin/country", {
          title: `مدن ${countryResults[0].ar_name}`,
          errMsg: "",
          countryArName: countryResults[0].ar_name,
          countryCode: countryResults[0].countryCode,
          cities: citiesResults,
        });
      }
    );
  });
};

const deleteCountry = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let countryCode = req.params.countryCode;

    console.log("adssd");

    City.find({ countryCode: countryCode }).then((cities) => {
      console.log("Cities", cities);

      if (cities.length != 0) {
        cities.forEach((city) => {
          City.deleteOne({ _id: city._id }).then(() => {
            Country.deleteOne({ countryCode: countryCode }).then(() => {
              res.redirect(`/admin/countries`);
            });
          });
        });
      } else {
        Country.deleteOne({ countryCode: countryCode }).then(() => {
          res.redirect(`/admin/countries`);
        });
      }
    });
  }
};

const showAddCityForm = (req, res) => {
  isLogged(req, res);
  let countryCode = strip_tags(req.params.countryCode);

  console.log(countryCode);

  Country.find({ countryCode: countryCode }).then((countryResult) => {
    res.render("admin/add-city", {
      title: `اضافة مدينة ل${countryResult[0].ar_name}`,
      errMsg: "",
      countryCode,
    });
  });
};

const addCityData = (req, res) => {
  isLogged(req, res);
  let countryCode = strip_tags(req.params.countryCode),
    cityArName = strip_tags(req.body.city_ar_name),
    cityEnName = strip_tags(req.body.city_en_name);

  if (
    countryCode.length <= 0 ||
    cityArName.length <= 0 ||
    cityEnName.length <= 0
  ) {
    res.render("admin/add-city", {
      title: `اضافة مدينة`,
      errMsg: `برجاء ملئ جميع الحقول التالية لإضافة مدينة`,
      countryCode,
    });
  } else {
    let country = new City({
      countryCode,
      ar_name: cityArName,
      en_name: cityEnName,
    });

    country.save();

    res.render("admin/add-city", {
      title: `اضافة مدينة`,
      errMsg: `تم الاضافة بنجاح`,
      countryCode,
    });
  }
};

const showCityData = (req, res) => {
  isLogged(req, res);

  let cityId = req.params.cityId;

  City.find({ _id: cityId }).then((cityResult) => {
    if (cityResult != 0) {
      res.render("admin/city", {
        title: cityResult[0].ar_name,
        errMsg: "",
        city: cityResult[0],
        countryCode: cityResult[0].countryCode,
      });
    } else {
      res.redirect("/404");
    }
  });
};

const editCityData = (req, res) => {
  isLogged(req, res);
  let countryCode = strip_tags(req.body.cityCountryCode),
    cityArName = strip_tags(req.body.city_ar_name),
    cityEnName = strip_tags(req.body.city_en_name),
    cityId = strip_tags(req.params.cityId);

  if (
    countryCode.length <= 0 ||
    cityArName.length <= 0 ||
    cityEnName.length <= 0
  ) {
    res.render("admin/city", {
      title: cityArName,
      errMsg: `برجاء ملئ جميع الحقول التالية لتعديل المدينة`,
    });
  } else {
    let newData = {
      ar_name: cityArName,
      en_name: cityEnName,
    };

    City.find({ _id: cityId }).then((cityResult) => {
      City.updateOne({ _id: cityId }, { $set: newData }).then(() => {
        res.redirect(`/admin/city/${cityId}`);
      });
    });
  }
};

const redtocity = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    City.find({ en_name: req.params.cityName }).then((results) => {
      res.redirect(`/admin/city/${results[0]._id}`);
    });
  }
};

const deleteCity = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let cityId = req.params.cityId;

    City.find({ _id: cityId }).then((cityResult) => {
      City.deleteOne({ _id: cityId }).then(() => {
        res.redirect(`/admin/country/${cityResult[0].countryCode}`);
      });
    });
  }
};

module.exports = {
  showUsers,
  showUserForm,
  addUserData,
  editUserForm,
  editUserData,
  deleteUser,
  showCountries,
  showAddCountryForm,
  addAddCountryData,
  showCountryData,
  deleteCountry,
  showAddCityForm,
  editCityData,
  redtocity,
  deleteCity,
  addCityData,
  showCityData,
};

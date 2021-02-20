const express = require("express");
const session = require("cookie-session");
const View = require("../models/view.js");
const {
  isLogged,
  login,
  logout,
  changePass,
} = require("../controllers/adminController.js");
const {
  settingsShow,
  settingsUpdate,
} = require("../controllers/settingController.js");
const {
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
  addCityData,
  showCityData,
  deleteCity,
  editCityData,
  redtocity,
} = require("../controllers/userController.js");
const {
  showPostForm,
  addPostData,
  showPosts,
  editPostDataShow,
  editPostData,
  showPostSectionForm,
  showPostSectionCotrolForm,
  editDuhaDataShow,
  editDuhaData,
  addPostSectionData,
  deletePost,
} = require("../controllers/postsController.js");
const upload = require("express-fileupload");

const router = express.Router();

router.use(upload());

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

router.get("/admin", (req, res) => {
  res.redirect("/admin/dashboard");
});

// Render Dashboard
router.get("/admin/dashboard", (req, res) => {
  isLogged(req, res);
  let dataMonth = parseInt(req.query.month) || new Date().getMonth() + 1,
    dataYear = parseInt(req.query.year) || new Date().getFullYear();

  View.find({ month: dataMonth, year: dataYear, type: "city" }).then(
    (cityResult) => {
      let citiesViewsCount = cityResult.length;

      View.find({
        month: dataMonth,
        year: dataYear,
        type: "post",
      }).then((postResult) => {
        let postsViewsCount = postResult.length;

        View.find({
          month: dataMonth,
          year: dataYear,
          type: "doaa",
        }).then((doaaResult) => {
          let doaasViewsCount = doaaResult.length;

          View.find({
            month: dataMonth,
            year: dataYear,
            type: "azkar",
          }).then((azkarResult) => {
            let azkarsViewsCount = azkarResult.length;

            res.render("admin/index", {
              citiesViewsCount,
              postsViewsCount,
              doaasViewsCount,
              azkarsViewsCount,
              title: "لوحة التحكم",
            });
          });
        });
      });
    }
  );
});

// Start Login
router.get("/admin/login", (req, res) => {
  isLogged(req, res);

  res.render("admin/login", { errMsg: "" });
});

router.post("/admin/login", login);
// End Login

// Start Add Post
router.get("/admin/add-post/:postType", showPostForm);

router.post("/admin/add-post/:postType", addPostData);
// End Add Post

// Start Add Post Section
router.get("/admin/add-post-section/:postType", showPostSectionForm);

router.get("/admin/delete-post-section/:postType", showPostSectionCotrolForm);

router.post("/admin/add-post-section/:postType", addPostSectionData);
// End Add Post Section

// Start Edit Post
router.get("/admin/edit-post/:postType/:postId", editPostDataShow);

router.post("/admin/edit-post/:postType/:postId", editPostData);
// End Edit Post

// Start Delete Post
router.get("/admin/delete-post/:postType/:postId", deletePost);

router.get("/admin/posts/:postType", showPosts);
// End Delete Post

// Duha & Istekhara Posts
router.get("/admin/edit-duha/:postCustom", editDuhaDataShow);

router.post("/admin/edit-duha/:postCustom", editDuhaData);
// Duha & Istekhara Posts

// Start Show User
router.get("/admin/users", showUsers);
// End Show User

// Start Add User Form
router.get("/admin/add-user", showUserForm);
// End Add User Form

// Start Add User
router.post("/admin/add-user", addUserData);
// End Add User

// Start Edit User Form
router.get("/admin/edit-user/:userId", editUserForm);
// End Edit User Form

// Start Edit User Data
router.post("/admin/edit-user/:userId", editUserData);
// End Edit User Data

// Start Edit User Data
router.get("/admin/delete-user/:userId", deleteUser);
// End Edit User Data\

// Start Contries & Cities Contollers
router.get("/admin/countries", showCountries);
router.get("/admin/add-country", showAddCountryForm);
router.post("/admin/add-country", addAddCountryData);
router.get("/admin/country/:countryCode", showCountryData);
router.get("/admin/delete-country/:countryCode", deleteCountry);

// Cities

router.get("/admin/add-city/:countryCode", showAddCityForm);
router.post("/admin/add-city/:countryCode", addCityData);
router.get("/admin/city/:cityId", showCityData);
router.post("/admin/city/:cityId", editCityData);
router.get("/admin/redtocity/:cityName", redtocity);
router.get("/admin/delete-city/:cityId", deleteCity);

// End Contries & Cities Contollers

// Start Settings Show
router.get("/admin/settings", settingsShow);
// End Settings Show

// Start Settings Show
router.post("/admin/settings", settingsUpdate);
// End Settings Show

// Start Change Password
router.get("/admin/change-pass", (req, res) => {
  isLogged(req, res);
  res.render("admin/change-pass", { errMsg: "" });
});

router.post("/admin/change-pass", changePass);
// End Change Password

// Start Logout
router.get("/admin/logout", logout);
// End Logout

module.exports = router;

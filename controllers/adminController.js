const pkg = require("password-hash");
const { generate, verify } = pkg;
const User = require("../models/user.js");

const strip_tags = (inp) => {
  return inp.replace(/(<([^>]+)>)/gi, "");
};

// Check If There is A req.session
const isLogged = (req, res) => {
  if (req.session.userName != undefined && req.url.includes("admin")) {
    if (req.url.includes("login")) {
      res.redirect("/admin/dashboard", { title: "لوحة التحكم" });
    }
  } else {
    if (req.url.includes("login") == false) {
      res.redirect("/admin/login");
    }
  }
};

const isAdmin = async (req, res) => {
  let value = "";
  User.find({ username: req.session.userName, role: 0 }).then((results) => {
    if (results.length > 0) {
      value = true;
    } else {
      value = false;
      req.session.userName = undefined;
      res.redirect("/admin/dashboard");
    }
    return value;
  });
};

const login = (req, res) => {
  let userName = strip_tags(req.body.username.replace(/ /g, "")),
    password = strip_tags(req.body.password.replace(/ /g, ""));

  User.find({ username: userName })
    .then((result) => {
      if (verify(password, result[0].password)) {
        req.session.userName = result[0].username;
        res.redirect("/admin/dashboard");
      } else {
        res.render("admin/login", { errMsg: "هناك خطأ في كلمة سر المستخدم" });
      }
    })
    .catch((err) => {
      res.render("admin/login", { errMsg: "هناك خطأ في اسم المستخدم" });
    });
};

const logout = (req, res) => {
  req.session.userName = undefined;

  res.redirect("/admin/login");
};

const changePass = (req, res) => {
  isLogged(req, res);

  let password = strip_tags(req.body.password.replace(/ /g, "")),
    newPassword = generate(strip_tags(req.body.new_password.replace(/ /g, "")));

  User.find({ username: req.session.userName })
    .then((result) => {
      if (verify(password, result[0].password)) {
        let newPass = {
            password: newPassword,
          },
          userId = result[0]._id;

        User.updateOne({ _id: userId }, { $set: newPass }).then(() => {
          console.log(result);

          res
            .render("admin/change-pass", {
              errMsg: "تم تغيير كلمة السر بنجاح",
            })
            .then(() => {
              setTimeout(() => {
                req.session.userName = undefined;
                res.redirect("/admin/login");
              }, 1000);
            });
        });
      } else {
        res.render("admin/change-pass", {
          errMsg: "كلمة السر الحالية غير مطابقة لكلمة سر الحساب",
        });
      }
    })
    .catch(() => {
      req.session.userName = undefined;
      isLogged(req, res);

      res.render("admin/change-pass", {
        errMsg: "برجاء تسجيل الدخول مرة اخري",
      });
    });
};

module.exports = { isLogged, login, isAdmin, logout, changePass };

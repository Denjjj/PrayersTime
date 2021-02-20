const settings = require("../models/settings.js");
const { isLogged, isAdmin } = require("./adminController.js");

const strip_tags = (inp) => {
  return inp.replace(/(<([^>]+)>)/gi, "");
};

const settingsShow = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    settings.find().then((result) => {
      res.render("admin/settings", {
        title: "الاعدادات",
        settings: result,
        errMsg: "",
      });
    });
  }
};

const settingsUpdate = (req, res) => {
  isLogged(req, res);
  if (isAdmin(req, res)) {
    let newImgDist = req.body.settingslogoDist;

    if (req.files != undefined || req.files != null) {
      let imgFile = req.files.imgUpload,
        rand = Math.random(1, 9999),
        imgFileExt = req.files.imgUpload.name.split(".")[
          imgFile.name.split(".").length - 1
        ];

      imgFile.mv(`./public/assets/main/${rand}.${imgFileExt}`);
      newImgDist = `/public/assets/main/${rand}.${imgFileExt}`;
    }

    let { settingsId, siteTitle, siteDesc, siteKeywords, siteEmail } = req.body,
      {
        settingsEnId,
        siteEnTitle,
        siteEnDesc,
        siteEnKeywords,
        siteEnEmail,
      } = req.body,
      arSettings = {
        settingsId,
        siteTitle,
        siteDesc,
        siteKeywords,
        siteEmail,
        logoDist: newImgDist,
      },
      enSettings = {
        settingsId: settingsEnId,
        siteTitle: siteEnTitle,
        siteDesc: siteEnDesc,
        siteKeywords: siteEnKeywords,
        siteEmail: siteEnEmail,
        logoDist: newImgDist,
      };

    if (
      siteTitle.length != 0 ||
      siteDesc.length != 0 ||
      siteKeywords.length != 0 ||
      siteEmail.length != 0 ||
      siteEnTitle.length != 0 ||
      siteEnDesc.length != 0 ||
      siteEnKeywords.length != 0 ||
      siteEnEmail.length != 0
    ) {
      settings.updateOne({ _id: settingsId }, arSettings).then(() => {
        settings.updateOne({ _id: settingsEnId }, enSettings).then(() => {});
      });

      settings.find().then((result) => {
        res.render("admin/settings", {
          title: "الاعدادات",
          settings: result,
          errMsg: "تم حفظ الاعدادات",
        });
      });
    }
  }
};

module.exports = { settingsShow, settingsUpdate };

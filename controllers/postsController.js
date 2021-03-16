const mongoose = require("mongoose");
const Post = require("../models/post.js");
const PostSection = require("../models/postSection.js");
const settings = require("../models/settings.js");
const View = require("../models/view.js");
const SmPost = require("../models/smPost.js");
const fetch = require("node-fetch");
const isLogged = require("./adminController.js").isLogged;

// Get User Data
let userIp = "";

let locationApiKey = `20b96dca8b9a5d37b0355e9461c66e76eed30a2274422fa6213d9de6ffb2b34e`;
fetch(`http://api.ipinfodb.com/v3/ip-city/?key=${locationApiKey}&format=json`)
  .then((res) => res.json())
  .then((json) => {
    return json;
  })
  .then((json) => {
    userIp = json.ipAddress;
  });

const strip_tags = (inp) => {
  return inp.replace(/(<([^>]+)>)/gi, "");
};

const showPostSectionForm = (req, res) => {
  isLogged(req, res);
  let postType = req.params.postType,
    postTypeValue = req.params.postType;
  postType == 0
    ? (postType = "ذكر")
    : postType == 1
    ? (postType = "دعاء")
    : (postType = "موضوع");

  res.render("admin/add-post-section", {
    title: `اضافة قسم ${postType}`,
    postTypeValue,
    errMsg: "",
  });
};

const showPostSectionCotrolForm = (req, res) => {
  isLogged(req, res);
  let postType = req.params.postType,
    postTypeValue = req.params.postType,
    deleteQuery = req.query.delete;
  postType == 0
    ? (postType = "ذكر")
    : postType == 1
    ? (postType = "دعاء")
    : (postType = "موضوع");

  console.log(deleteQuery);

  if (postTypeValue == 2) {
    res.redirect(`/admin/posts/${postTypeValue}`);
  }

  if (deleteQuery != "") {
    PostSection.deleteOne({ _id: deleteQuery }).then(() => {
      res.redirect(`/admin/delete-post-section/${postTypeValue}`);
    });
  }

  PostSection.find({ type: postTypeValue }).then((results) => {
    res.render("admin/delete-post-section", {
      title: `حذف قسم ${postType}`,
      postTypeValue,
      sections: results,
      errMsg: "",
    });
  });
};

const addPostSectionData = (req, res) => {
  isLogged(req, res);
  let postTitle = strip_tags(req.body.post_section_title),
    postLang = strip_tags(req.body.post_section_lang),
    postType = strip_tags(req.params.postType),
    postTypeValue = strip_tags(req.params.postType);

  postType == 0
    ? (postType = "ذكر")
    : postType == 1
    ? (postType = "دعاء")
    : (postType = "موضوع");

  if (postTitle.length <= 0) {
    res.render("admin/add-post-section", {
      title: `اضافة قسم ${postType}`,
      postTypeValue,
      errMsg: `برجاء ملئ جميع الحقول التالية لإضافة ${postType}`,
    });
  } else {
    let postSection = new PostSection({
      title: postTitle,
      type: postTypeValue,
      lang: postLang,
    });

    postSection.save();

    res.render("admin/add-post-section", {
      title: `اضافة قسم ${postType}`,
      postTypeValue,
      errMsg: `تم الاضافة بنجاح`,
    });
  }
};

const showPostForm = (req, res) => {
  isLogged(req, res);
  let postType = req.params.postType,
    postTypeValue = req.params.postType;
  postType == 0
    ? (postType = "ذكر")
    : postType == 1
    ? (postType = "دعاء")
    : (postType = "موضوع");

  PostSection.find({ type: postTypeValue }).then((results) => {
    res.render("admin/add-post", {
      title: `اضافة ${postType}`,
      postTypeValue,
      postSections: results,
      errMsg: "",
    });
  });
};

const addPostData = (req, res) => {
  isLogged(req, res);
  let postTitle = strip_tags(req.body.post_title),
    postContent = strip_tags(req.body.post_content),
    postTypeValue = strip_tags(req.params.postType),
    postLang = strip_tags(req.body.post_lang),
    postType = strip_tags(req.params.postType),
    postCount = req.body.post_count,
    postSection = req.body.post_section;

  PostSection.find({ type: postTypeValue }).then((results) => {
    let postSections;

    results[0] != undefined
      ? (postSections = results[0]._id)
      : (postSections = "");

    postType == 0
      ? (postType = "ذكر")
      : postType == 1
      ? (postType = "دعاء")
      : (postType = "موضوع");

    if (
      postTitle.length <= 0 ||
      postContent.length <= 0 ||
      (postSections.length == 0 && (postTypeValue == 0 || postTypeValue == 1))
    ) {
      if (postSections.length == 0) {
        res.render("admin/add-post", {
          title: `اضافة ${postType}`,
          postTypeValue,
          postSections: results,
          errMsg: `برجاء اضافة قسم جديد قبل الاضافة`,
        });
      } else {
        res.render("admin/add-post", {
          title: `اضافة ${postType}`,
          postTypeValue,
          postSections: results,
          errMsg: `برجاء ملئ جميع الحقول التالية لإضافة ${postType}`,
        });
      }
    } else {
      if (postTypeValue == 0 || postTypeValue == 1) {
        let post = new Post({
          title: postTitle,
          content: postContent,
          type: postTypeValue,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          postSection: postSection,
          postCount: postCount,
          lang: postLang,
        });

        post.save();

        res.render("admin/add-post", {
          title: `اضافة ${postType}`,
          postTypeValue,
          postSections: results,
          errMsg: `تم الاضافة بنجاح`,
        });
      } else {
        let post = new Post({
          title: postTitle,
          content: postContent,
          type: postTypeValue,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          lang: postLang,
        });

        post.save().then(() => {
          res.render("admin/add-post", {
            title: `اضافة ${postType}`,
            postTypeValue,
            postSections: results,
            errMsg: `تم اضافة الموضوع بنجاح`,
          });
        });
      }
    }
  });
};

const editPostDataShow = (req, res) => {
  isLogged(req, res);
  let postId = req.params.postId,
    postTypeValue = strip_tags(req.params.postType);

  Post.findById(postId).then((results) => {
    let postData = {
      title: results.title,
      content: results.content,
      type: results.type,
      month: results.month,
      postCount: results.postCount,
      year: results.year,
      lang: results.lang,
    };

    res.render("admin/edit-post", {
      title: `تعديل`,
      postId,
      postTypeValue,
      postData,
      errMsg: ``,
    });
  });
};

const editPostData = (req, res) => {
  isLogged(req, res);
  let postId = req.params.postId,
    postTypeValue = strip_tags(req.params.postType);

  let newPostData = {
    title: strip_tags(req.body.post_title),
    content: strip_tags(req.body.post_content),
    postCount: strip_tags(req.body.post_count),
  };

  Post.updateOne({ _id: postId }, { $set: newPostData }).then(() => {
    res.render("admin/edit-post", {
      title: `تعديل`,
      postId,
      postTypeValue,
      postData: newPostData,
      errMsg: `تم التعديل بنجاح`,
    });
  });
};

const editDuhaDataShow = (req, res) => {
  isLogged(req, res);
  let postCustom = req.params.postCustom,
    postCustomAr = "الضحي";

  if (postCustom == "duha" || postCustom == "istikharah") {
    if (postCustom == "istikharah") {
      postCustomAr = "الاستخارة";
    }

    Post.find({ postcustom: postCustom }).then((results) => {
      res.render("admin/edit-duha", {
        title: `تعديل`,
        postData: results,
        postCustom,
        postCustomAr,
        errMsg: ``,
      });
    });
  } else {
    res.redirect("/admin/posts/3");
  }
};

const editDuhaData = (req, res) => {
  isLogged(req, res);
  let postCustom = req.params.postCustom,
    newPostDataAr = {
      content: strip_tags(req.body.post_ar_content),
    },
    newPostDataEn = {
      content: strip_tags(req.body.post_en_content),
    },
    postCustomAr = "الضحي";

  if (postCustom == "istikharah") {
    postCustomAr = "الاستخارة";
  }

  Post.updateOne(
    { postcustom: postCustom, lang: "ar" },
    { $set: newPostDataAr }
  ).then(() => {
    Post.updateOne(
      { postcustom: postCustom, lang: "en" },
      { $set: newPostDataEn }
    ).then(() => {
      res.redirect(`/admin/edit-duha/${postCustom}`);
    });
  });
};

const deletePost = (req, res) => {
  isLogged(req, res);
  let postId = req.params.postId,
    postTypeValue = strip_tags(req.params.postType);

  Post.deleteOne({ _id: postId }).then(() => {
    console.log("Deleted");
  });

  res.redirect(`/admin/posts/${postTypeValue}`);
};

const showPosts = (req, res) => {
  isLogged(req, res);

  let postTypeValue = strip_tags(req.params.postType),
    lang = req.query.postLang || "ar",
    postShowMonth = req.query.month || new Date().getMonth() + 1,
    postShowYear = req.query.year || new Date().getFullYear(),
    postType = strip_tags(req.params.postType),
    postTypeName = strip_tags(req.params.postType);

  postType == 0
    ? (postType = "ادارة الأذكار")
    : postType == 1
    ? (postType = "ادارة الأدعية")
    : (postType = "ادارة المواضيع");

  postTypeName == 0
    ? (postTypeName = "الأذكار")
    : postTypeName == 1
    ? (postTypeName = "الأدعية")
    : (postTypeName = "المواضيع");

  Post.find({
    lang: lang,
    type: postTypeValue,
    month: postShowMonth,
    year: postShowYear,
  })
    .sort({ createdAt: -1 })
    .then((result) => {
      PostSection.find().then((postSectionResults) => {
        if (postSectionResults.length > 0) {
          let data = {},
            postSectionNames = postSectionResults.forEach(
              (postSectionResult) => {
                data[postSectionResult._id] = postSectionResult.title;
              }
            );

          res.render("admin/posts", {
            title: postType,
            postTypeName,
            postSectionNames: data,
            postTypeValue,
            posts: result,
          });
        } else {
          res.render("admin/posts", {
            title: postType,
            postTypeName,
            postTypeValue,
            posts: result,
          });
        }
      });
    });
};

const showClientPosts = (req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((settingResults) => {
      let postType = req.params.postType,
        postTypeValue = req.params.postType;
      postType == 0
        ? (postType = "اذكار - Azkar")
        : postType == 1
        ? (postType = "أدعية - Dua")
        : (postType = "مواضيع - Posts");

      PostSection.find({ type: postTypeValue, lang: langQuery }).then(
        (results) => {
          let sectionData = [];
          let sections = results.map((section) => section);

          for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            let sectionObj = {
              _id: section._id,
              title: section.title,
              type: section.type,
            };
            sectionData[i] = { ...sectionObj };
          }

          if (postTypeValue == 0 || postTypeValue == 1) {
            res.render("posts/index", {
              title: postType,
              lang: langQuery,
              siteTitle: settingResults.siteTitle,
              desc: settingResults.siteDesc,
              email: settingResults.siteEmail,
              logoDist: settingResults.logoDist,
              keyword: settingResults.siteKeywords,
              posts: sectionData,
            });
          } else if (postTypeValue == 2) {
            Post.find({ type: postTypeValue }).then((postResults) => {
              res.render("posts/index", {
                title: postType,
                posts: postResults,
                siteTitle: settingResults.siteTitle,
                postSection: "",
                lang: langQuery,
                desc: settingResults.siteDesc,
                email: settingResults.siteEmail,
                logoDist: settingResults.logoDist,
                keyword: settingResults.siteKeywords,
              });
            });
          }
        }
      );
    });
};

const showTypePosts = (req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((settingResults) => {
      let postShowId = req.params.postShowId,
        postShowName,
        id = req.params.id;

      if (postShowId == 0) {
        postShowName = "azkar";
      } else if (postShowId == 1) {
        postShowName = "doaa";
      } else if (postShowId == 2) {
        postShowName = "post";
      }

      PostSection.find({ _id: id, type: postShowId }).then((results) => {
        let postSectionId = results[0]._id,
          postSectionTitle = results[0].title;

        let url = `/post/show/${postSectionId}`;

        Post.find({ postSection: id }).then((postResults) => {
          let view = new View({
            url: url,
            view: 1,
            type: postShowName,
            ip: userIp,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            day: new Date().getDay(),
            lang: langQuery,
          });

          View.find({
            ip: userIp,
            day: new Date().getDay(),
            type: postShowName,
          }).then((result) => {
            if (result.length < 1) {
              view.save();
            }
          });

          res.render("posts/show", {
            title: postSectionTitle,
            posts: postResults,
            siteTitle: settingResults.siteTitle,
            desc: settingResults.siteDesc,
            email: settingResults.siteEmail,
            logoDist: settingResults.logoDist,
            keyword: settingResults.siteKeywords,
            lang: langQuery,
          });
        });
      });
    });
};

const showOnlyPost = (req, res) => {
  let langQuery = req.query.lang || "ar";

  settings
    .find({ lang: langQuery })
    .then((results) => results[0])
    .then((settingResults) => {
      let postId = req.params.postId;

      Post.find({ _id: postId }).then((postResults) => {
        let url = `/post/t/${postResults._id}`;

        let view = new View({
          url: url,
          view: 1,
          type: "post",
          ip: userIp,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          day: new Date().getDay(),
          lang: langQuery,
        });

        View.find({ ip: userIp, day: new Date().getDay(), type: "post" }).then(
          (result) => {
            if (result.length < 1) {
              view.save();
            }
          }
        );
        res.render("posts/only", {
          title: postResults[0].title,
          post: postResults,
          siteTitle: settingResults.siteTitle,
          desc: settingResults.siteDesc,
          email: settingResults.siteEmail,
          logoDist: settingResults.logoDist,
          keyword: settingResults.siteKeywords,
          lang: langQuery,
        });
      });
    });
};

// Add smPost
const addSmPostGet = (req, res) => {
  isLogged(req, res);

  res.render("admin/add-sm-post", {
    title: `اضافة منشور قصير`,
    errMsg: ``,
  });
};
const addSmPostPost = (req, res) => {
  isLogged(req, res);
  let { icon, sayer, content, lang } = req.body;

  if (strip_tags(content) == "") {
    res.render("admin/add-sm-post", {
      title: `اضافة منشور قصير`,
      errMsg: `برجاء ملئ جميع الحقول`,
    });
  } else {
    let newSmPost = new SmPost({
      icon,
      sayer,
      content,
      lang,
    });

    newSmPost.save().then(() => {
      res.render("admin/add-sm-post", {
        title: `اضافة منشور قصير`,
        errMsg: `تم الاضافة بنجاح`,
      });
    });
  }
};

// Edit smPost
const editSmPostGet = async (req, res) => {
  isLogged(req, res);

  let smPostId = req.params.smPostId;
  let smPostData = await SmPost.findOne({ _id: smPostId });

  res.render("admin/edit-sm-post", {
    title: `تعديل منشور قصير`,
    smPostData,
    errMsg: ``,
  });
};
const editSmPostPost = async (req, res) => {
  isLogged(req, res);
  let { icon, sayer, content, lang } = req.body,
    smPostId = req.params.smPostId,
    smPostData = await SmPost.findOne({ _id: smPostId }),
    newSmPostData = {
      _id: smPostId,
      icon: icon,
      sayer: sayer,
      content: content,
      lang: lang,
    };

  if (strip_tags(content) == "") {
    res.render("admin/edit-sm-post", {
      title: `تعديل منشور قصير`,
      smPostData,
      errMsg: `برجاء ملئ جميع الحقول`,
    });
  } else {
    let newSmPost = {
      icon,
      sayer,
      content,
      lang,
    };

    SmPost.findOneAndUpdate({ _id: smPostId }, { $set: newSmPost }).then(() => {
      res.render("admin/edit-sm-post", {
        title: `تعديل منشور قصير`,
        smPostData: newSmPostData,
        errMsg: `تم التعديل بنجاح`,
      });
    });
  }
};

// Delete SmPost
const deleteSmPostGet = async (req, res) => {
  isLogged(req, res);

  let smPostId = req.params.smPostId;

  SmPost.deleteOne({ _id: smPostId }).then(() => {
    res.redirect("/admin/sm-posts");
  });
};

// Show SmPost
const showSmPosts = async (req, res) => {
  isLogged(req, res);
  let smPosts = await SmPost.find();

  res.render("admin/sm-posts", {
    title: `المنشورات القصيرة`,
    smPosts,
  });
};

module.exports = {
  showPostForm,
  addPostData,
  showPosts,
  editPostDataShow,
  editPostData,
  editDuhaDataShow,
  editDuhaData,
  addPostSectionData,
  showPostSectionForm,
  showPostSectionCotrolForm,
  deletePost,
  showClientPosts,
  showTypePosts,
  showOnlyPost,
  addSmPostGet,
  addSmPostPost,
  editSmPostGet,
  editSmPostPost,
  showSmPosts,
  deleteSmPostGet,
};

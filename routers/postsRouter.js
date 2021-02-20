const express = require("express");
const {
  showClientPosts,
  showTypePosts,
  showOnlyPost,
} = require("../controllers/postsController.js");

const router = express.Router();

// Show All Posts
router.get("/posts/:postType", showClientPosts);

// Show Azkar & Dua Post
router.get("/post/show/:postShowId/:id", showTypePosts);

// Show Normal Post
router.get("/post/t/:postId", showOnlyPost);

module.exports = router;

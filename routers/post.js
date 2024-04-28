// const { postCreate, postDelete, postGet, postFeed } = require('../controllers/post')

import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createPost,
  getFeed,
  getUserPosts,
  likePost,
  dislikePost,
  deletePost,
  editPermission,
  editPost,
  getBookmarkedPosts,
  bookmarkPost,
  unbookmarkPost,
} from "../controllers/post.js";


const router = express.Router();
router.post("/create", isAuthenticated, createPost);
router.post("/feed", isAuthenticated, getFeed);
router.post("/user", isAuthenticated, getUserPosts);
router.post("/like", isAuthenticated, likePost);
router.post("/dislike", isAuthenticated, dislikePost);
router.post("/delete", isAuthenticated, deletePost);
router.post("/editPermission", isAuthenticated, editPermission);
router.post("/edit", isAuthenticated, editPost);
router.post("/bookmarks", isAuthenticated, getBookmarkedPosts);
router.post("/bookmark", isAuthenticated, bookmarkPost);
router.post("/unbookmark", isAuthenticated, unbookmarkPost);

export default router;

// const router = require('express').Router()

// router.get('/get', postGet)
// router.get('/feed', postFeed)
// router.post('/create', postCreate)
// router.post('/delete', postDelete)

// module.exports = router

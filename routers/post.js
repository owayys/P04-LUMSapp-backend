// const { postCreate, postDelete, postGet, postFeed } = require('../controllers/post')

import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createPost,
  getFeed,
  likePost,
  dislikePost,
  deletePost,
  editPermission,
  editPost,
} from "../controllers/post.js";

const router = express.Router();
router.post("/create", isAuthenticated, createPost);
router.post("/feed", isAuthenticated, getFeed);
router.post("/like", isAuthenticated, likePost);
router.post("/dislike", isAuthenticated, dislikePost);
router.post("/delete", isAuthenticated, deletePost);
router.post("/editPermission", isAuthenticated, editPermission);
router.post("/edit", isAuthenticated, editPost);

export default router;

// const router = require('express').Router()

// router.get('/get', postGet)
// router.get('/feed', postFeed)
// router.post('/create', postCreate)
// router.post('/delete', postDelete)

// module.exports = router

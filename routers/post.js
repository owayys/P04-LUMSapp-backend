// const { postCreate, postDelete, postGet, postFeed } = require('../controllers/post')

import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  createPost,
  getFeed,
  likePost,
  dislikePost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();
router.post("/create", isAuthenticated, createPost);
router.get("/feed", isAuthenticated, getFeed);
router.post("/like", isAuthenticated, likePost);
router.post("/dislike", isAuthenticated, dislikePost);
router.delete("/delete", isAuthenticated, deletePost);

export default router;

// const router = require('express').Router()

// router.get('/get', postGet)
// router.get('/feed', postFeed)
// router.post('/create', postCreate)
// router.post('/delete', postDelete)

// module.exports = router

import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

//READ
router.get("/",verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//UPDATE
router.put("/:id/like", verifyToken, likePost);
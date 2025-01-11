import express from 'express';
import {
    getUser,
    getUserFriends, 
    addRemoveFriend,
} from '../controllers/users.js';
// Middleware to verify the token
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

//READ
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);

//UPDATE
router.put('/:id/:friendId', verifyToken, addRemoveFriend);
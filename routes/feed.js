const express = require('express');
const router = express.Router();
const {getPosts, postPosts, getPost, updatePost, deletePost} = require('../controllers/feed')
const {body} = require('express-validator')

router.get('/posts', getPosts);
router.post('/posts', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], postPosts);

router.get('/post/:postId', getPost)

router.put('/post/:postId', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], updatePost);

router.delete('/post/:postId', deletePost)

module.exports = router;
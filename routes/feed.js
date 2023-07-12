const express = require('express');
const router = express.Router();
const {getPosts, postPosts, getPost, updatePost, deletePost} = require('../controllers/feed')
const {body} = require('express-validator')
const isAuth = require('../middleware/is-auth')

router.get('/posts', isAuth, getPosts);
router.post('/posts', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], postPosts);

router.get('/post/:postId', isAuth, getPost)

router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], updatePost);

router.delete('/post/:postId', isAuth, deletePost)

module.exports = router;
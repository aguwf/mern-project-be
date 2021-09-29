import express from 'express'
import * as postHandle from '../controllers/posts.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.route('/').get(postHandle.getPost).post(auth, postHandle.addPost)

router.route('/deleted').get(auth, postHandle.getDeletedPost)

router.route('/restore/:id').put(auth, postHandle.restorePost)

router
  .route('/:id')
  .put(auth, postHandle.updatePost)
  .delete(auth, postHandle.deletePost)

router.route('/likePost/:id').put(auth, postHandle.likePost)

router.route('/search/').get(postHandle.searchPost)

router.route('/:id').get(postHandle.getSinglePost)

export default router

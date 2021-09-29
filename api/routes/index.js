import express from 'express'
import postRoute from './postsRoute.js'
import userRoute from './usersRoute.js'
const router = express.Router()

router.use('/posts', postRoute)
router.use('/users', userRoute)

export default router

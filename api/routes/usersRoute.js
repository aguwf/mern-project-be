import express from 'express'
import * as userHandle from '../controllers/users.js'
const router = express.Router()

router.route('/signin').post(userHandle.signin)
router.route('/signup').post(userHandle.signup)
// router.route('/').get(userHandle.getUser).post(userHandle.addUser)
// router.route('/:id').put(userHandle.updateUser).delete(userHandle.deleteUser)

export default router

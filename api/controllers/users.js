import User from '../models/userModel.js'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

const signin = async (req, res) => {
  try {
    const { email, password } = req.body
    const existUser = await User.findOne({ email })

    if (!existUser) {
      return res.status(404).json({ message: 'User does not exist !!!' })
    }

    const passwordIsCorrect = await bcrypt.compare(password, existUser.password)

    if (!passwordIsCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const token = Jwt.sign(
      { email: existUser.email, id: existUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    )

    res.status(200).json({ result: existUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' + error })
  }
}

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPass } = req.body

    const existUser = await User.findOne({ email })

    if (existUser) {
      return res.status(404).json({ message: 'User already exist !!!' })
    }

    if (password !== confirmPass) {
      return res.status(400).json({ message: 'Password do not match .' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    })

    const token = Jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    res.status(201).json({ result, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' + error })
  }
}

const getPost = async (req, res) => {
  try {
    const pageIndex = parseInt(req.query._page)
    const limit = parseInt(req.query._limit)
    const skip = (pageIndex - 1) * limit
    const response = await PostMessage.find({ isValid: true }, { __v: 0 })
      .skip(skip)
      .limit(limit)
    const returnedPost = response.map((post) => post.toClient())
    const totalPage = Math.ceil(
      (await PostMessage.countDocuments({ isValid: true })) / limit
    )
    res.status(200).json({ listPost: returnedPost, totalPage })
  } catch (error) {
    res.status(400).json({ message: error })
  }
}

const addPost = async (req, res) => {
  try {
    const post = req.body
    const { textSearch } = req.query
    const newPost = await PostMessage.create(post)
    const totalRecord = textSearch
      ? await PostMessage.countDocuments({
          name: { $regex: textSearch },
          isValid: true
        })
      : await PostMessage.countDocuments({ isValid: true })
    res.status(201).json({ newPost, totalRecord })
  } catch (error) {
    console.log(error)
    res.status(409).json({ message: error })
  }
}

const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No post with id ' + id)
    const post = req.body
    const { textSearch } = req.query
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true
    })
    const totalRecord = textSearch
      ? await PostMessage.countDocuments({
          name: { $regex: textSearch },
          isValid: true
        })
      : await PostMessage.countDocuments({ isValid: true })
    res.status(200).json({ updatedPost, totalRecord })
  } catch (error) {
    res.status(409).json({ message: error })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No post with id ' + id)
    const { textSearch } = req.query
    console.log(id, textSearch)
    const deletedPost = await PostMessage.findByIdAndUpdate(
      id,
      { isValid: false },
      {
        new: true
      }
    )
    const totalRecord = textSearch
      ? await PostMessage.countDocuments({
          name: { $regex: textSearch },
          isValid: true
        })
      : await PostMessage.countDocuments({ isValid: true })
    res.status(200).json({ deletedPost, totalRecord })
  } catch (error) {
    res.status(409).json({ message: error })
  }
}

export { getPost, addPost, updatePost, deletePost, signin, signup }

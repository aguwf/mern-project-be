import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose'

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

const getDeletedPost = async (req, res) => {
  try {
    const response = await PostMessage.find({ isValid: false }, { __v: 0 })
    const returnedPost = response.map((post) => post.toClient())
    res.status(200).json({ listDeletedPost: returnedPost })
  } catch (error) {
    res.status(400).json({ message: error })
  }
}

const addPost = async (req, res) => {
  try {
    const post = req.body
    const { textSearch } = req.query
    const newPost = await PostMessage.create({
      ...post,
      creator: req.userId,
      creatAt: new Date().toISOString()
    })
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

const restorePost = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No post with id ' + id)
    const restoredPost = await PostMessage.findByIdAndUpdate(
      id,
      { isValid: true },
      { new: true }
    )
    res.status(200).json({ restoredPost })
  } catch (error) {
    res.status(409).json({ error })
  }
}

const likePost = async (req, res) => {
  try {
    if (!req.userId) {
      res.json({ message: 'Unauthenticated !' })
    }
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No post with id ' + id)

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
      //like post
      post.likes.push(req.userId)
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId))
      //dislike post
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true
    })

    res.status(200).json({ updatedPost })
  } catch (error) {
    res.status(409).json({ error })
  }
}

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send('No post with id ' + id)

    const post = await PostMessage.findById(id)

    const recommendPost = await PostMessage.aggregate([
      { $match: { isValid: true } },
      { $sample: { size: 5 } }
    ])

    console.log(recommendPost.length)

    res.status(200).json({ post, recommendPost })
  } catch (error) {
    res.status(409).json({ error })
  }
}

const searchPost = async (req, res) => {
  try {
    const { q, tags } = req.query
    const pageIndex = parseInt(req.query._page)
    const limit = parseInt(req.query._limit)
    const skip = (pageIndex - 1) * limit
    console.log(q, tags, pageIndex, limit)

    const title = new RegExp(q, 'i')
    const response = await PostMessage.find({
      $or: [
        { title, isValid: true },
        { tags: { $all: [tags] }, isValid: true }
      ]
    })
      .skip(skip)
      .limit(limit)
    console.log(response.map((item) => item.title))
    const returnedPost = response.map((post) => post.toClient())

    const totalPage = Math.ceil(
      (await PostMessage.countDocuments({
        $or: [
          { title, isValid: true },
          { tags: { $all: [tags] }, isValid: true }
        ]
      })) / limit
    )

    res.status(200).json({ listPost: returnedPost, totalPage })
  } catch (error) {
    console.log(error)
    res.status(409).json({ error })
  }
}

export {
  getPost,
  addPost,
  updatePost,
  deletePost,
  getDeletedPost,
  restorePost,
  likePost,
  getSinglePost,
  searchPost
}

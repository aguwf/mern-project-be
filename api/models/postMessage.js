import mongoose from 'mongoose'
const Schema = mongoose.Schema
const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Nhap tieu de']
  },
  message: {
    type: String
  },
  name: {
    type: String
  },
  creator: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  selectedFile: {
    type: String
  },
  likes: {
    type: [String],
    default: []
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  isValid: {
    type: Boolean,
    default: true
  }
})

postSchema.method('toClient', function () {
  let objRes = this.toObject()
  objRes.id = objRes._id
  delete objRes._id
  return objRes
})

export default mongoose.model('PostMessage', postSchema)

import Mongoose from 'mongoose'

const Schema = Mongoose.Schema
const model = Mongoose.model

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Nhap email']
  },
  password: {
    type: String,
    required: [true, 'Nhap mat khau']
  },
  name: {
    type: String,
    required: [true, 'Nhap ten']
  }
})

UserSchema.method('toClient', function () {
  let objRes = this.toObject()
  objRes.id = objRes._id
  delete objRes._id
  return objRes
})

export default model('User', UserSchema)

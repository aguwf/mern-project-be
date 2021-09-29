import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import createHttpError from 'http-errors'
import routes from './api/routes/index.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
)

const PORT = process.env.PORT || 3010
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())

app.use(helmet())
app.use(logger('dev'))

mongoose.Promise = global.Promise
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected MongoDB !!!')
  })
  .catch((err) => {
    console.log(err)
  })

//Define route
app.use('/api', routes)
app.use('/', (req, res) => {
  res.send('Hello passenger this is mern project')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // response json error with unexpected error
  res.status(err.status || 500)
  res.json({ err: err.message })
})

app.listen(PORT)

console.log('mern API server started on: ' + PORT)

export default app

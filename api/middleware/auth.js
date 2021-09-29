import Jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    const isCustomAuth = token.length < 250

    let decodedData

    if (token && isCustomAuth) {
      decodedData = Jwt.verify(token, process.env.SECRET_KEY)

      req.userId = decodedData?.id
    } else {
      decodedData = Jwt.decode(token)
      console.log(decodedData)
      req.userId = decodedData?.sub
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

export default auth

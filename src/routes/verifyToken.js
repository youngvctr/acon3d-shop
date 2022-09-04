const jwt = require('jsonwebtoken')

/** Jason web token publish */
async function signJWT(findUser) {
  return await new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: findUser._id,
        isAdmin: findUser.isAdmin,
        isWriter: findUser.isWriter,
      },
      process.env.JWT_SEC, //secret key
      { expiresIn: '1d' }, //86400 24hour
      (err, encoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(encoded)
        }
      }
    )
  })
}

/** verify token */
async function verifyToken(token) {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SEC, (err, value) => {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })
}

/** verify token on login user */
const verifyTokenAndAuth = async (req, res, next) => {
  const accessToken = req.myCookies
  jwt.verify(accessToken, process.env.JWT_SEC, (err, value) => {
    if (req.userId || req.isAdmin) {
      req.isAdmin ? console.log('Hello, Admin') : console.log('Hello, User')
      return true
    } else {
      console.log('You are not allowed to access with authorization')
      return false
    }
  })
}

/** verify token on Admin user */
const verifyTokenAndAdmin = async (req, res, next) => {
  const accessToken = req.myCookies
  jwt.verify(accessToken, process.env.JWT_SEC, (err, value) => {
    //console.log(req)
    if (req.isAdmin) {
      console.log('Hello, Admin')
      return true
    } else {
      console.log('You are not allowed to access with admin')
      return false
    }
  })
}

/** verify token on Writer user */
const verifyTokenAndWriter = async (req, res, next) => {
  const accessToken = req.myCookies
  jwt.verify(accessToken, process.env.JWT_SEC, (err, value) => {
    if (req.isWriter) {
      console.log('Hello, Writer')
      return true
    } else {
      console.log('You are not allowed to access with writer permission')
      return false
    }
  })
}

module.exports = {
  signJWT,
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndWriter,
  verifyTokenAndAdmin,
}

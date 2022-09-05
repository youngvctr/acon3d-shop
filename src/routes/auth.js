const router = require('express').Router()
const cryptoJS = require('crypto-js')
const user = require('../models/user')
const { verifyToken, signJWT } = require('./verifyToken')

/* logout */
router.get('/signout', async (req, res) => {
  try {
    req.session.destroy()
    res.clearCookie('accessToken')
    res.clearCookie('connect.sid')
    res.redirect('/')
    console.log(`routes/auth | Logout was successful`)
  } catch (err) {
    console.log(`routes/auth | ${err}`)
    res.render('error', {
      title: 'acon3d-shop',
      message: 'routes/auth | Something was wrong',
    })
  }
})

/** register */
router
  .route('/register')
  .get(async (req, res) => {
    await res.render('users/signup', {
      title: 'acon3d-shop',
    })
  })
  .post(async (req, res) => {
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    })

    try {
      const savedUser = await newUser.save()
      res.redirect('/')
      console.log(`${savedUser} ; Sign up is successful`)
    } catch (err) {
      console.log(`routes/auth | ${err}`)
      res.render('error', {
        title: 'acon3d-shop',
        message: 'Routes/auth | Something was wrong',
      })
    }
  })

/** login */
router
  .route('/signin')
  .get(async (req, res) => {
    await res.render('users/signin', {
      title: 'acon3d-shop',
    })
  })
  .post(async (req, res) => {
    try {
      const findUser = await user.findOne({ username: req.body.username })
      if (!findUser) {
        console.log('routes/auth | Login was wrong')
        return res.render('error', {
          title: 'acon3d-shop',
          message: 'Routes/auth | status(401), Something was wrong',
        })
      }

      const hashedPassword = cryptoJS.AES.decrypt(
        findUser.password,
        process.env.PASS_SEC
      )
      const oPassword = hashedPassword.toString(cryptoJS.enc.Utf8)

      if (oPassword !== req.body.password) {
        console.log('routes/auth | Login was wrong')
        return res.render('error', {
          title: 'acon3d-shop',
          message: 'Routes/auth | status(401), Wrong credentials',
        })
      } else {
        const accessToken = await signJWT(findUser)
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
        })

        const userId = await verifyToken(accessToken)
        if (userId) {
          req.params.userId = userId
          req.params.accessToken = accessToken
        }

        console.log(`routes/auth | ${userId.id}, 로그인 완료`)
        res.redirect(`/api/auth/${userId.id}/`)
      }
    } catch (err) {
      console.log(`routes/auth | ${err}, Something was wrong`)
      res.render('error', {
        title: 'acon3d-shop',
        message: 'Routes/auth | status(500), Something was wrong',
      })
    }
  })

/* profile */
router.get('/:id/', async (req, res) => {
  await res.render('users/profile', {
    title: 'acon3d-shop',
    uid: req.userId,
    id: req.username,
    accessToken: req.cookies.accessToken,
    pass: true,
    auth: req.auth,
    admin: req.isAdmin,
    writer: req.isWriter,
  })
})

module.exports = router

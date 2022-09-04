// @ts-check
const express = require('express')
const router = express.Router()

/* Main page */
router.get('/', async (req, res) => {
  try {
    const cookies = await req.cookies
    if (cookies) {
      res.render('index', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
      })
    } else {
      await res.render('index', {
        title: 'acon3d-shop',
      })
    }
  } catch (err) {
    console.log(err)
    res.render('error', {
      title: 'acon3d-shop',
      message: err,
    })
  }
})

module.exports = router

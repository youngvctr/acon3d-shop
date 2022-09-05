// @ts-check
const cryptoJS = require('crypto-js')
const user = require('../models/user')

const router = require('express').Router()

/** 수정 */
router
  .route('/:id')
  .put(async (req, res) => {
    if (req.body.password) {
      req.body.password = cryptoJS.AES.encrypt(
        req.body.password,
        // @ts-ignore
        process.env.PASS_SEC
      ).toString()
    }

    try {
      const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  })
  /** 삭제 */
  .delete(async (req, res) => {
    try {
      await user.findByIdAndDelete(req.params.id)
      res.status(200).json('User has been deleted :V')
    } catch (err) {
      res.status(500).json(err)
    }
  })

/* 전체 유저 확인 / admin만 지원*/
router.get('/', async (req, res) => {
  const admin = await req.isAdmin
  if (admin) {
    const query = req.query.new
    try {
      const dUser = query
        ? await user.find().sort({ _id: -1 })
        : await user.find()
      console.log(dUser)
      return await res.render('users/user', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
        user: dUser,
      })
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    return await res.render('users/setting', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
    })
  }
})

module.exports = router

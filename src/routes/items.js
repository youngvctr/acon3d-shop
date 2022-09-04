// @ts-check
const router = require('express').Router()
const select = require('../models/select')

/** Item list */
router.route('/').get(async (req, res) => {
  const selects = await select.find({}).sort({ createdAt: -1 })
  if (selects) {
    return res.render('resource/items', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
      products: selects,
    })
  }
})

module.exports = router

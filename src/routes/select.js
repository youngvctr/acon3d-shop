// @ts-check
const select = require('../models/select')
const product = require('../models/product')
const router = require('express').Router()

/** Writer's request list */
router.route('/').get(async (req, res) => {
  await res.render('resource/listforadm', {
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

/** update */
router
  .route('/:id')
  .post(async (req, res) => {
    const newSelect = new select({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      commission: req.body.commission,
    })
    try {
      const savedSelect = await newSelect.save()
      res.status(200).json(savedSelect)
    } catch (err) {
      res.status(500).json(err)
    }
  })
  .put(async (req, res) => {
    await res.render('resource/select', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
    })
    try {
      const updatedProduct = await select.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedProduct)
    } catch (err) {
      //res.status(500).json(err)
    }
  }) /*delete*/
  .delete(async (req, res) => {
    try {
      const delContents = await select.findByIdAndDelete(req.params.id)
      res.status(200).json(`'${delContents}' has been deleted :V`)
    } catch (err) {
      //res.status(500).json(err)
    }
  })

/** list */
router.route('/list').get(async (req, res) => {
  try {
    const selects = await product.find().sort({ createdAt: -1 })

    if (selects) {
      return res.render('resource/listforadm', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
        selects: selects,
      })
    } else {
      console.log(`Select routes | There has no list`)
    }
  } catch (err) {
    console.log(`Select routes | Something was wrong`)
    return await res.render('error', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
      message: err,
    })
  }
})

module.exports = router

// @ts-check
const product = require('../models/product')
const router = require('express').Router()

/** product request page */
router
  .route('/')
  .get(async (req, res) => {
    await res.render('resource/product', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
    })
  }) // product request
  .post(async (req, res) => {
    console.log(req.body)
    const newProduct = new product({
      title: req.body.title,
      writer: req.body.writer,
      request: req.body.request,
      description: req.body.description,
      price: req.body.price,
    })
    try {
      const savedProduct = await newProduct.save()
      console.log(`Routes product | ${savedProduct} request is successful`)
      res.redirect('/api/products/list/:id')
    } catch (err) {
      res.render('error', {
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
      console.log(`Routes product | Product request is fail`)
    }
  })

/** update page */
router
  .route('/:id')
  .get(async (req, res) => {
    const products = await product
      .find({ id: req.userId })
      .sort({ createdAt: -1 })
    if (products) {
      return res.render('resource/product', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
        products: products,
      })
    }
  }) /** Update 요청 */
  .put(async (req, res) => {
    try {
      const updatedProduct = await product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )
      res.status(200).json(updatedProduct)
    } catch (err) {
      res.status(500).json(err)
    }
  }) /** Delete 요청 */
  .delete(async (req, res) => {
    try {
      await product.findByIdAndDelete(req.params.id)
      res.status(200).json('Product has been deleted :V')
    } catch (err) {
      res.status(500).json(err)
    }
  })

/** product request 목록 출력 */
router.route('/list/:id').get(async (req, res) => {
  try {
    const products = await product
      .find({ id: req.userId })
      .sort({ createdAt: -1 })

    if (products) {
      return res.render('resource/listforwrt', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
        products: products,
      })
    } else {
      console.log(`Product routes | There has no list`)
    }
  } catch (err) {
    console.log(`Product routes | ${err}`)
  }
})

module.exports = router

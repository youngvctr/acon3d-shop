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
    //console.log('body:', req.body)
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
      console.log(`Routes product | Product request is fail. ${err}`)
    }
  })

/** Update 요청, command line*/
router.route('/:id/modify').put(async (req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    console.log(
      `Routes product | Product ${updatedProduct} Update request succeeded`
    )
    res.status(200).json(updatedProduct)
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
  }
})

/** Update page loading*/
router.route('/modify').post(async (req, res) => {
  const products = await product.findOne({ id: req.body.id[2] })
  console.log(products)
  if (products) {
    return res.render('resource/product-modify', {
      title: 'acon3d-shop',
      uid: req.userId,
      id: req.username,
      accessToken: req.cookies.accessToken,
      pass: true,
      auth: req.auth,
      admin: req.isAdmin,
      writer: req.isWriter,
      pWriter: products.writer,
      pTitle: products.title,
      pDescription: products.description,
      pPrice: products.price,
      pId: products.id,
    })
  }
  try {
    console.log(
      `Routes product | Product ${updatedProduct} Update request succeeded`
    )
    res.redirect('/api/products/list/:id')
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
  }
})

/** Request Update Data, front-end */
router.route('/modify/request').post(async (req, res) => {
  try {
    console.log('***************body: ', req.body)
    const updatedProduct = await product.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    console.log(
      `Routes product | Product ${updatedProduct} Update request succeeded`
    )
    res.redirect('/api/products/list/:id')
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
  }
})

/** Request Delete, command line*/
router.route('/:id/delete').delete(async (req, res) => {
  try {
    const result = await product.findByIdAndDelete(req.params.id)
    console.log(
      `Routes product | Product ${req.params.id} Delete request succeeded`
    )
    res.status(200).json(result)
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
  }
})

/** Request Delete , front-end*/
router.route('/delete').post(async (req, res) => {
  try {
    //console.log(req.body.title)
    const checkTitle = await product.findOne({
      id: req.body.title,
    })
    //console.log(JSON.stringify(checkUser))
    await product.findByIdAndDelete(checkTitle.id)
    //console.log(`result ${result}`)
    console.log(
      `Routes product | Product ${checkTitle.id} Delete request succeeded`
    )
    res.redirect('/api/products/list/:id')
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
  }
})

/** product request 목록 출력 */
router.route('/list/:id').get(async (req, res) => {
  try {
    const products = await product
      .find({ writer: req.username })
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

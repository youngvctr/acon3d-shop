// @ts-check
const select = require('../models/select')
const product = require('../models/product')
const router = require('express').Router()

router
  .route('/:id')
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
  }) /*삭제*/
  .delete(async (req, res) => {
    try {
      const delContents = await select.findByIdAndDelete(req.params.id)
      res.status(200).json(`'${delContents}' has been deleted :V`)
    } catch (err) {
      //res.status(500).json(err)
    }
  })

/** 관리자 발행, Item 출력*/
router.route('/publish/:id').post(async (req, res) => {
  try {
    console.log(req.body.id[2])
    const checkTitle = await product.findOne({
      _id: req.body.id[2],
    })
    console.log(checkTitle)
    if (checkTitle) {
      const newSelect = new select({
        title: checkTitle.title,
        writer: checkTitle.writer,
        request: checkTitle.request,
        description: checkTitle.description,
        price: checkTitle.price,
        commission: checkTitle.commission,
      })
      const savedProduct = await newSelect.save()
      console.log(`Routes select | ${savedProduct} request is successful`)
    }
    res.redirect('/api/select/list/')
  } catch (err) {
    console.log(`Routes select | Select request is fail. ${err}`)
  }
})

/** 관리자 발행 전, 수정 페이지 출력 */
router.post('/modify/:id', async (req, res) => {
  try {
    const selects = await product.findOne({ _id: req.body.id[2] })
    console.log(selects)
    if (selects) {
      var commission = selects.commission
      if (commission === null) {
        commission = 0
      }
      return await res.render('resource/select-modify', {
        title: 'acon3d-shop',
        uid: req.userId,
        id: req.username,
        accessToken: req.cookies.accessToken,
        pass: true,
        auth: req.auth,
        admin: req.isAdmin,
        writer: req.isWriter,
        pWriter: selects.writer,
        pTitle: selects.title,
        pDescription: selects.description,
        pCommission: commission,
        pPrice: selects.price,
        pId: selects.id,
      })
    }
    console.log(
      `Routes select | Select ${selects} Update page loading succeeded`
    )
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
  }
})

/** 수정내용을 DB에 Upload 요청, front-end */
router.route('/modify/request/:id').post(async (req, res) => {
  try {
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
    res.redirect('/api/select/list/')
  } catch (err) {
    console.log(console.log(`Product routes | ${err}`))
    res.status(500).json(err)
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

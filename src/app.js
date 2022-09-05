// @ts-check
const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// ROUTER
const routeIndex = require('./routes/index')
const routeUser = require('./routes/user')
const routeAuth = require('./routes/auth')
const routeProduct = require('./routes/product')
const routeSelect = require('./routes/select')
const routeItems = require('./routes/items')

// token
const { verifyToken } = require('./routes/verifyToken')

// models
const user = require('./models/user')

require('dotenv').config()
const app = express()

// db
mongoose // @ts-ignore
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`DB conncection is successfull:D`))
  .catch((err) => {
    console.log(err)
  })

// handlebar template engine
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'layout',
  })
)
app.set('view engine', '.hbs')
app.set('views', './src/views')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// session
app.use(
  session({
    secret: 'secret-message',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
      maxAge: 24000 * 60 * 60, //24시간
    },
  })
)
app.use(express.static(path.join(__dirname, 'public')))

// token
app.use(async (req, res, next) => {
  res.locals.session = req.session
  const { accessToken } = req.cookies
  if (accessToken) {
    const findUser = await verifyToken(accessToken)
    if (findUser) {
      const checkUser = await user.findOne({
        _id: findUser.id,
      })

      if (checkUser) {
        // @ts-ignore
        req.userId = checkUser.id
        req.username = checkUser.username
        req.isAdmin = checkUser.isAdmin
        req.isWriter = checkUser.isWriter
        req.auth = true
        req.myCookies = accessToken
      }
    } else {
      console.log(`app.js | User Profile is unloaded.`)
    }
  }
  next()
})

// routes
app.use('/', routeIndex)
app.use('/api/users', routeUser)
app.use('/api/auth', routeAuth)
app.use('/api/products', routeProduct)
app.use('/api/select', routeSelect)
app.use('/api/items', routeItems)

// error
app.use((req, res, next) => {
  res.status(404).send('Sorry, Not Found :(')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error :<')
})

app.listen(process.env.PORT, () =>
  console.log(
    `Server is listening... => http://localhost:${process.env.PORT} 🎉`
  )
)

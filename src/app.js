// @ts-check
const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
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

mongoose // @ts-ignore
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`DB conncection is successfull:D`))
  .catch((err) => {
    console.log(err)
  })

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
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  res.locals.session = req.session

  const { accessToken } = req.cookies
  if (accessToken) {
    const findUser = await verifyToken(accessToken)
    //console.log(`findUser ; ${findUser}`)
    //console.log(findUser.id)
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
        // console.log(`
        //              ** User Profile
        //              - Id: ${req.userId},
        //              - Name: ${req.username},
        //              - Admin: ${req.isAdmin},
        //              - Writer: ${req.isWriter}
        //              - AccessToken: ${accessToken}`)
      }
    } else {
      console.log(`** User Profile ?`)
    }
  }
  next()
})

app.use('/', routeIndex)
app.use('/api/users', routeUser)
app.use('/api/auth', routeAuth)
app.use('/api/products', routeProduct)
app.use('/api/select', routeSelect)
app.use('/api/items', routeItems)

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

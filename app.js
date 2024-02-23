const express = require('express')
const app = express()
const port = 6969
const session = require("express-session")
const path = require('path')
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')))

//session (global)
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

//midware
const ifIn = (req, res, next) => {
  const { userId } = req.session;
  if (userId) {
      return res.redirect("/user");
  }
  next();
};

//login n signup
app.get('/', Controller.home)
app.get('/home', Controller.directHome)
app.get('/signup', Controller.signUp)
app.post('/signup', Controller.signUpProcess)
app.get('/login', ifIn, Controller.login)
app.post('/login', Controller.loginProcess)
app.get('/login/admin', Controller.loginAdmin)
app.post('/login/admin', Controller.loginAdminProcess)

app.use(function (req, res, next) {
    if (!req.session.userId) {
        const error = "Please login first"
        res.redirect(`/login?error=${error}`)
    }
    else {
        next()
    }
})
app.get('/logout', Controller.logout)

// Admin Session

app.get('/admin', Controller.homeAdmin)
app.post('/admin', Controller.homeAdmin)

app.get("/admin/products", Controller.showProductAdmin);

app.get('/admin/products/add', Controller.getAddNewProduct)
app.post('/admin/products/add', Controller.postAddNewProduct)

app.get('/admin/products/edit/:id', Controller.getEditProduct)
app.post('/admin/products/edit/:id', Controller.postEditProduct)

app.get('/admin/products/delete/:id',Controller.deleteProduct)

// User Session

app.get('/user', Controller.homeUser)
app.get('/products', Controller.showProduct)
app.get('/products/buy/:id', Controller.buyProduct)
app.get('/products/soldlist', Controller.soldProduct)

app.listen(port, () => {
  console.log(`Listening to fuck this ${port}`)
})
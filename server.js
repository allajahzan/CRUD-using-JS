// npm modules
const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require('path');
const nocache = require("nocache");
const mongoose = require('mongoose');
const morgan = require('morgan')


//local module
const router = require('./router');
const config = require('./config/uuid')


// app settings
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views/user'),
    path.join(__dirname, 'views/admin')
]);


// mongoDB coonection
const url = 'mongodb+srv://allajahzan:allajahzan123@firstproject.58v4i.mongodb.net/?retryWrites=true&w=majority&appName=firstProject'
mongoose.connect(url)
    .then(() => console.log("connected with mongoDB"))
    .catch((err) => console.log(err))



// middle-wears

app.use(express.json())
app.use(express.static('public'));
app.use(express.static('api'));
app.use(express.static('uploads'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret: config,
    resave: false,
    saveUninitialized: true
}))
app.use(nocache());
app.use(morgan('dev'))


// router middle-wear
app.use('/', router);
app.use('/*', router);


app.listen(3000, () => {
    console.log("Server is running on port 3000 http://localhost:3000");
})

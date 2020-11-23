'use strict';

let express = require('express');
let routes = require('./routes/index');
const cors = require('cors');
let methodOverride = require('method-override');

require("dotenv").config()

let app = express();
let mongoose = require('mongoose');
var bodyParser = require('body-parser');
var admin = require('./config');
app.use(bodyParser.json())
var path = require('path');
global.appRoot = path.resolve(__dirname);
// app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.static('uploads'));
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors())
app.use('/api', routes);
global.CustomError = require('./utilities/custom_error');
const multer = require('multer');
let urlencodedParser=bodyParser.urlencoded({ extended: true });

// mongo
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useCreateIndex: true});

// mongo


// firebase

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
});
const upload = multer({ storage: storage });


const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

app.post('/firebase/notification', (req, res)=>{

    // let token = FirebaseMessagingService.onNewToken()
    const  registrationToken = req.body.registrationToken
    console.log(admin.admin.messaging());
    // const message = {payload: req.body.message}
    const options =  notification_options
    // return admin.messaging().sendToTopic('tets',message, options);
    admin.admin.messaging().sendToDevice(registrationToken, req.body.message, options)
      .then( response => {

       res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

})

// firebase
app.get('/', async (req, res) => {
  res.render('login', { banners: [] });
});
app.set('view engine', 'ejs');

app.listen( process.env.PORT || 3000,()=>{console.log(`server running on port ${process.env.PORT}`)});

module.exports = app;

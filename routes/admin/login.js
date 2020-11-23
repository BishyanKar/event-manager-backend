'use strict';
var express = require('express');
var router = express.Router();
const LoginController = require('../../controllers/admin/login')
const multer = require('multer');
var upload = multer();

router.post('/login', upload.none(), async (req, res) => {
    try {
        let login = new LoginController(req.body);
        let response = await login.login();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


router.post('/view-login', upload.none(), async (req, res) => {
    try {
        let login = new LoginController(req.body);
        let response = await login.adminlogin();
        res.render('admin/admin-home',  {currentUser: response.response} );

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
module.exports = router;
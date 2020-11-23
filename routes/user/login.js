'use strict';
var express = require('express');
var router = express.Router();
const LoginController = require('../../controllers/user/login')
const multer = require('multer');
var upload = multer();

router.post('/', upload.none(), async (req, res) => {
    try {
        let login = new LoginController(req.body);
        let response = await login.login();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/',  async (req, res) => {
    res.render('login', { banners: [] });
});
router.post('/view-login', upload.none(), async (req, res) => {
    try {
        let login = new LoginController(req.body);
        let response = await login.login();
        res.render('user/user-home',  {currentUser: response.response} );

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/logout', async (req, res) => {
    res.render('login');
});
module.exports = router;
'use strict';
var express = require('express');
var router = express.Router();
const SignupController = require('../../controllers/user/signup')
const ProfileController = require('../../controllers/user/profile')
var ProfileModel = require('../../models/user/profile')
const multer = require('multer');
const { response } = require('express');
var upload = multer();

router.post('/', upload.none(), async (req, res) => {
    try {
        let signup = new SignupController(req.body);
        let response = await signup.signup();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/view-signup', upload.none(), async (req, res) => {
    try {
        let signup = new SignupController(req.body);
        let response = await signup.signup();
        res.render('admin/admin-home', response);

    } catch (error) { 
        res.redirect('/');   
    }
});

router.get('/username-check', upload.none(), async (req, res) => {
    let response = []
    response = await ProfileModel.findOne({username: req.query.username}).lean();
    if(response){
        res.json({
            unique: false
        })
    } else {
        res.json({
            unique: true
        })
    }
})

router.post('/addGenre', upload.none(), async (req, res) => {
    try{
        let profile = new ProfileController(req.body);
        let response = await profile.addGenre()
        res.json({
            success: true
        })
    } catch(error){
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
    
})





router.get('/', async (req, res) => {
    res.render('signup', { banners: [] });
});


module.exports = router;
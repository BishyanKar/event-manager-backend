'use strict';
var express = require('express');
var router = express.Router();
const ProfileController = require('../../controllers/user/profile')
const multer = require('multer');
var upload = multer();

router.get('/:id', async (req, res) => {
    try {
        let profile = new ProfileController(req.body,req.params);
        let response = await profile.profileByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        let profile = new ProfileController(req.body,req.params);
        let response = await profile.updateProfile();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
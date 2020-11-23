'use strict';
var express = require('express');
var router = express.Router();
const GoodiesController = require('../../controllers/base/goodie')

router.get('/list', async (req, res) => {
    try {
        let goodie = new GoodiesController();
        let response = await goodie.goodiesList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let goodie = new GoodiesController(req.body,req.params);
        let response = await goodie.goodieByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
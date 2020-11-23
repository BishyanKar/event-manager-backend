'use strict';
var express = require('express');
var router = express.Router();
const BandController = require('../../controllers/base/band')

router.get('/list', async (req, res) => {
    try {
        let band = new BandController();
        let response = await band.bandList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let band = new BandController(req.body,req.params);
        let response = await band.bandByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});



module.exports = router;
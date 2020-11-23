'use strict';
var express = require('express');
var router = express.Router();
const DrinksController = require('../../controllers/base/drink')

router.get('/list', async (req, res) => {
    try {
        let drink = new DrinksController();
        let response = await drink.drinksList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let drink = new DrinksController(req.body,req.params);
        let response = await drink.drinkByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
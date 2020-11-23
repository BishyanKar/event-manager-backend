'use strict';
var express = require('express');
var router = express.Router();
const FoodController = require('../../controllers/base/food')

router.get('/list', async (req, res) => {
    try {
        let food = new FoodController();
        let response = await food.foodList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let food = new FoodController(req.body,req.params);
        let response = await food.foodByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
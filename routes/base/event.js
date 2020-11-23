'use strict';
var express = require('express');
var router = express.Router();
const EventsController = require('../../controllers/base/event')

router.get('/list', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.eventList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.eventByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/rewards/:count', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.rewardsByGuestCount();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/voucher', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.voucherSelection();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/attending-list', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.attendingList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/giveaway-list', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.giveawaysList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/fandb-list', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.fandBList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
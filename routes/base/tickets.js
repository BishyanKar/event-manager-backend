'use strict';
var express = require('express');
var router = express.Router();
const TicketsController = require('../../controllers/base/tickets')
const multer = require('multer');
const e = require('express');
var upload = multer();

router.get('/list', async (req, res) => {
    try {
        let tickets = new TicketsController(req.body,req.params);
        let response = await tickets.fetchTickets();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/type', async (req, res) => {
    try {
        let tickets = new TicketsController(req.body,req.params);
        let response = await tickets.typesList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let tickets = new TicketsController(req.body,req.params);
        let response = await tickets.ticketByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


router.post('/book', upload.none() , async (req, res) => {
    try {
        // console.log(req.body);
        let tickets = new TicketsController(req.body);
        let response = await tickets.bookTickets();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


module.exports = router;
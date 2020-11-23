'use strict';
var express = require('express');
var router = express.Router();
const InboxController = require('../../controllers/base/inbox')

router.get('/list', async (req, res) => {
    try {
        let inbox = new InboxController();
        let response = await inbox.messageList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let inbox = new InboxController();
        let response = await inbox.messageByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/send', async (req, res) => {
    try {
        let inbox = new InboxController();
        let response = await inbox.send();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


router.post('/sent-list', async (req, res) => {
    try {
        let inbox = new InboxController();
        let response = await inbox.sentMessages();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

module.exports = router;
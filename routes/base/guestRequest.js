'use strict';
var express = require('express');
var router = express.Router();
const GuestRequestController = require('../../controllers/base/guestRequest')

router.get('/list/:event_id', async (req, res) => {
    try {
        let guestRequestController = new GuestRequestController( {eventID: req.params.event_id});
        let response = await guestRequestController.guestRequestsByEvent();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let guestRequestController = new GuestRequestController(req.body,req.params);
        let response = await guestRequestController.guestRequestByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/book', async (req, res) => {
  try {
      let guestRequestController = new GuestRequestController(req.body,req.params);
      let response = await guestRequestController.requestGuestEntry();
      res.send(response);

  } catch (error) { 
      res.status(error.statusCode || 500).send({ success: false, message: error.message});
  }
})

router.post('/addUser', async (req, res) => {
  try {
      let guestRequestController = new GuestRequestController(req.body,req.params);
      let response = await guestRequestController.addUser();
      res.send(response);

  } catch (error) { 
      res.status(error.statusCode || 500).send({ success: false, message: error.message});
  }
})

router.post('/book', async (req, res) => {
  try {
      let guestRequestController = new GuestRequestController(req.body,req.params);
      let response = await guestRequestController.requestGuestEntry();
      res.send(response);

  } catch (error) { 
      res.status(error.statusCode || 500).send({ success: false, message: error.message});
  }
})

router.post('/checkReferalID', async (req, res) => {
  try {
      let guestRequestController = new GuestRequestController(req.body,req.params);
      let response = await guestRequestController.checkReferalID();
      res.send(response);

  } catch (error) { 
      res.status(error.statusCode || 500).send({ success: false, message: error.message});
  }
})

module.exports = router;
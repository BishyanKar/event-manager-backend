'use strict';
var express = require('express');
var router = express.Router();
const ArtistController = require('../../controllers/base/artist')

router.get('/list', async (req, res) => {
    try {
        let artist = new ArtistController();
        let response = await artist.artistList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let artist = new ArtistController(req.body,req.params);
        let response = await artist.artistByID();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/events/:id', async (req, res) => {
    try {
        let artist = new ArtistController();
        let response = await artist.eventsPerArtist();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});




// // for view

// router.get('/view-all', async (req, res) => {
//     try {
//         let artist = new ArtistController();
//         let response = await artist.artistList();
//         res.render('admin/artist', {artists: response.response})
//     } catch (error) { 
//         res.status(error.statusCode || 500).send({ success: false, message: error.message});
//     }
// });

// // for view

module.exports = router;
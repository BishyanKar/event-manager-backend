'use strict';
var express = require('express');
var router = express.Router();
const AdminController = require('../../controllers/admin/admin')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads') 
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
  });
  const upload = multer({ storage: storage });
const login = require('./login');
router.use('/', login);
const ArtistController = require('../../controllers/base/artist')
const BandController = require('../../controllers/base/band')
const TicketsController = require('../../controllers/base/tickets')
const EventsController = require('../../controllers/base/event')
const FoodController = require('../../controllers/base/food')
const DrinksController = require('../../controllers/base/drink')
const GoodiesController = require('../../controllers/base/goodie')
var bodyParser = require('body-parser');
const { app } = require('firebase-admin');
let urlencodedParser=bodyParser.urlencoded({ extended: true });
const spotifyApi = require('../../common/spotify')



router.get('/user-list', async (req, res) => {
    try {
        let admin = new AdminController(req.body);
        let response = await admin.getAllUsers();
        res.send(response);
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/changeStatus/:id',upload.none(), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.changeStatus();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/upcoming-events', async (req, res) => {
    try {
        let admin = new AdminController(req.body);
        let response = await admin.upcomingEventsList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.get('/past-events', async (req, res) => {
    try {
        let admin = new AdminController(req.body);
        let response = await admin.pastEventsList();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.post('/add-event', upload.single('event-poster'), async (req, res) => {
    // console.log('heter')
    try {
        // console.log("here")
        // console.log(req.file)
        let admin = new AdminController(req.body, req.params, req.file);
        let response = await admin.addEvent();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.put('/edit-event/:id',urlencodedParser,  upload.single('image'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.editEvent();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

router.delete('/delete-event/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteEvent();
        res.send(response);

    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


router.get('/dashboard', async (req, res) => {
    res.render('admin/admin-home');
});

//---------------------------------------------------------
//           USER
//---------------------------------------------------------

// for view
router.get('/all-users', async (req, res) => {
    try {
        let admin = new AdminController(req.body);
        let response = await admin.getAllUsers();
        res.render('admin/all-users', {users: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-user-id/:id', upload.none(), async (req, res) => {
    res.render(`admin/edit-user`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-user-view/:id', upload.single('image'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let resp = await admin.editUser();

        let response = await admin.getAllUsers();
        res.render('admin/all-users', {users: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-user/:id', async (req, res) => {
    try { 
        let admin = new AdminController(req.body,req.params);
        let resp = await admin.deleteUser();
        
        let response = await admin.getAllUsers();
        res.render('admin/all-users', {users: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//---------------------------------------------------------------------
//            ARTISTS
//---------------------------------------------------------------------


router.get('/all-artists', async (req, res) => {
    try {
        let artist = new ArtistController();
        let response = await artist.artistList();
        res.render('admin/artist', {'artists': response})
        // res.render('admin/artist', { artists: {
        //     response,
        //     image_base_url: '/image/'
        // }})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-artists', upload.none(), async (req, res) => {
    res.render('admin/add-artists')
});
router.post('/add-artists', upload.single('profile_img'), async (req, res) => {
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.addArtists();

        let artist = new ArtistController();
        let resp= await artist.artistList();
        res.render('admin/artist', { artists: resp, image_base_url: '/image/' })
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-artists-id/:id', upload.single('images'), async (req, res) => {
    res.render(`admin/edit-artists`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-artists/:id',urlencodedParser, upload.single('profile_img'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.editArtists();

        let artist = new ArtistController();
        let resp= await artist.artistList();
        res.render('admin/artist', { artists: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-artist/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteArtists();
        
        let artist = new ArtistController();
        let resp= await artist.artistList();
        res.render('admin/artist', { artists: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//-----------------------------------------------------------------------
//            EVENTS
//-----------------------------------------------------------------------


router.get('/all-events', async (req, res) => {
    try {
        let event = new EventsController(req.body,req.params);
        let response = await event.eventListAdmin();
        res.render('admin/event', {events: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-event', upload.none(), async (req, res) => {
    res.render('admin/add-event')

});
router.post('/add-event-view',upload.single('images'), async (req, res) => {
    try {
        let admin = new AdminController(req.body, null, req.file);
        let resp = await admin.addEvent();
        let event = new EventsController(req.body,req.params);
        let response = await event.eventListAdmin();
        res.render('admin/event', {events: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-event-id/:id', upload.none(), async (req, res) => {
    res.render(`admin/edit-event`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-event-view/:id', upload.single('images'),async (req, res) => {
    // console.log(req.body)
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params, req.file);
        let resp = await admin.editEvent();

        let event = new EventsController(req.body,req.params);
        let response = await event.eventListAdmin();
        res.render('admin/event', {events: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-event-view/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let resp = await admin.deleteEvent();
        
        let event = new EventsController(req.body,req.params);
        let response = await event.eventListAdmin();
        res.render('admin/event', {events: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


router.get('/add-event/searchArtist', function(req, res){
    spotifyApi.searchArtists(req.query.query)
    .then(function(data) {
        console.log('Result:', data.body);
        res.json(data.body.artists)
    }, function(err) {
        console.error(err);
    });
})

router.get('/edit-event-id/:id/searchArtist', function(req, res){
    spotifyApi.searchArtists(req.query.query)
    .then(function(data) {
        console.log('Result:', data.body);
        res.json(data.body.artists)
    }, function(err) {
        console.error(err);
    });
})

router.get('/add-event/searchFood', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchFood()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})
router.get('/edit-event-id/:id/searchFood', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchFood()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})

router.get('/add-event/searchDrink', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchDrink()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})
router.get('/edit-event-id/:id/searchDrink', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchDrink()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})

router.get('/add-event/searchGoodie', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchGoodie()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})
router.get('/edit-event-id/:id/searchGoodie', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchGoodie()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})

router.get('/add-event/searchType', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchType()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})
router.get('/edit-event-id/:id/searchType', async function(req, res){
    try{
        let admin = new AdminController(null, null, null, req.query)
        let resp = await admin.searchType()
        res.json(resp)
    } catch(error){
        console.log(error)
        res.json([])
    }
    
})


//----------------------------------------------------------------------------
//            TICKETS
//---------------------------------------------------------------------------

router.get('/all-tickets', async (req, res) => {
    try {
        let tickets = new TicketsController(req.body,req.params);
        let response = await tickets.fetchTickets();
        res.render('admin/tickets', {tickets: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
// router.get('/add-ticket', upload.none(), async (req, res) => {
//     res.render('admin/add-ticket')

// });
// router.post('/add-ticket-view',upload.single('images'), async (req, res) => {
//     try {
//         let tick = new TicketsController(req.body);
//         let resp = await tick.bookTickets();

//         let tickets = new TicketsController(req.body,req.params);
//         let response = await tickets.fetchTickets();
//         res.render('admin/tickets', {tickets: response})
//     } catch (error) { 
//         res.status(error.statusCode || 500).send({ success: false, message: error.message});
//     }
// });
// router.get('/edit-ticket-id/:id', upload.none(), async (req, res) => {
//     res.render(`admin/edit-ticket`, {b : {
//         _id: req.params.id
//     }})
// });
// router.put('/edit-ticket-view/:id',urlencodedParser, async (req, res) => {
//     try {
//         let tick = new TicketsController(req.body,req.params, req.file);
//         let resp = await tick.editTicket();

//         let tickets = new TicketsController(req.body,req.params);
//         let response = await tickets.fetchTickets();
//         res.render('admin/tickets', {tickets: response})
//     } catch (error) { 
//         res.status(error.statusCode || 500).send({ success: false, message: error.message});
//     }
// });
router.get('/delete-ticket-view/:id', async (req, res) => {
    try {
        let tick = new TicketsController(req.body, req.params);
        let resp = await tick.deleteTicket();
        
        let tickets = new TicketsController(req.body,req.params);
        let response = await tickets.fetchTickets();
        res.render('admin/tickets', {tickets: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//-----------------------------------------------------------------------
//          BANDS
//----------------------------------------------------------------------


router.get('/all-bands', async (req, res) => {
    try {
        let band = new BandController();
        let response = await band.bandList();
        res.render('admin/band', {bands: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-band', upload.none(), async (req, res) => {
    res.render('admin/add-band')

});
router.post('/add-band-view',upload.single('images'), async (req, res) => {
    try {
        let bandCon = new BandController(req.body);
        let resp = await bandCon.addBand();

        let band = new BandController();
        let response = await band.bandList();
        res.render('admin/band', {bands: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-band-id/:id', upload.none(), async (req, res) => {
    res.render(`admin/edit-band`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-band-view/:id',urlencodedParser, async (req, res) => {
    try {
        let bandCon = new BandController(req.body,req.params, req.file);
        let resp = await bandCon.editBand();

        let band = new BandController();
        let response = await band.bandList();
        res.render('admin/band', {bands: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-band-view/:id', async (req, res) => {
    try {
        let bandCon = new BandController(req.body, req.params);
        let resp = await bandCon.deleteBand();
        
        let band = new BandController();
        let response = await band.bandList();
        res.render('admin/band', {bands: response})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
})
// for view



//---------------------------------------------------------------------------
//           FOOD
//---------------------------------------------------------------------------


router.get('/all-food', async (req, res) => {
    try {
        let food = new FoodController();
        let response = await food.foodList();
        res.render('admin/food/index', {'food': response})
        // res.render('admin/food', { food: {
        //     response,
        //     image_base_url: '/image/'
        // }})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-food', upload.none(), async (req, res) => {
    res.render('admin/food/add')
});
router.post('/add-food', upload.single('profile_img'), async (req, res) => {
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.addFood();

        let food = new FoodController();
        let resp= await food.foodList();
        res.render('admin/food/index', { food: resp, image_base_url: '/image/' })
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-food-id/:id', upload.single('images'), async (req, res) => {
    res.render(`admin/food/edit`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-food/:id',urlencodedParser, upload.single('profile_img'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.editFood();

        let food = new FoodController();
        let resp= await food.foodList();
        res.render('admin/food/index', { food: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-food/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteFood();
        
        let food = new FoodController();
        let resp= await food.foodList();
        res.render('admin/food/index', { food: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//---------------------------------------------------------------------------
//           DRINKS
//---------------------------------------------------------------------------


router.get('/all-drinks', async (req, res) => {
    try {
        let drink = new DrinksController();
        let response = await drink.drinksList();
        res.render('admin/drink/index', {'drinks': response})
        // res.render('admin/drink', { drink: {
        //     response,
        //     image_base_url: '/image/'
        // }})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-drink', upload.none(), async (req, res) => {
    res.render('admin/drink/add')
});
router.post('/add-drink', upload.single('profile_img'), async (req, res) => {
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.addDrink();

        let drink = new DrinksController();
        let resp= await drink.drinksList();
        res.render('admin/drink/index', { drinks: resp, image_base_url: '/image/' })
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-drink-id/:id', upload.single('images'), async (req, res) => {
    res.render(`admin/drink/edit`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-drink/:id',urlencodedParser, upload.single('profile_img'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.editDrink();

        let drink = new DrinksController();
        let resp= await drink.drinksList();
        res.render('admin/drink/index', { drinks: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-drink/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteDrink();
        
        let drink = new DrinksController();
        let resp= await drink.drinksList();
        res.render('admin/drink/index', { drinks: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//---------------------------------------------------------------------------
//           GOODIES
//---------------------------------------------------------------------------


router.get('/all-goodies', async (req, res) => {
    try {
        let goodie = new GoodiesController();
        let response = await goodie.goodiesList();
        res.render('admin/goodie/index', {'goodies': response})
        // res.render('admin/goodie', { goodie: {
        //     response,
        //     image_base_url: '/image/'
        // }})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-goodie', upload.none(), async (req, res) => {
    res.render('admin/goodie/add')
});
router.post('/add-goodie', upload.single('profile_img'), async (req, res) => {
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.addGoodie();

        let goodie = new GoodiesController();
        let resp= await goodie.goodiesList();
        res.render('admin/goodie/index', { goodies: resp, image_base_url: '/image/' })
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-goodie-id/:id', upload.single('images'), async (req, res) => {
    res.render(`admin/goodie/edit`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-goodie/:id',urlencodedParser, upload.single('profile_img'), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.editGoodie();

        let goodie = new GoodiesController();
        let resp= await goodie.goodiesList();
        res.render('admin/goodie/index', { goodies: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-goodie/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteGoodie();
        
        let goodie = new GoodiesController();
        let resp= await goodie.goodiesList();
        res.render('admin/goodie/index', { goodies: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});

//---------------------------------------------------------------------------
//           TICKET TYPES
//---------------------------------------------------------------------------


router.get('/all-types', async (req, res) => {
    try {
        let type = new TicketsController();
        let response = await type.typesList();
        res.render('admin/type/index', {'types': response})
        // res.render('admin/type', { type: {
        //     response,
        //     image_base_url: '/image/'
        // }})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/add-type', upload.none(), async (req, res) => {
    res.render('admin/type/add')
});
router.post('/add-type', upload.none(), async (req, res) => {
    try {
        // console.log(req.file)
        let admin = new AdminController(req.body,req.params);
        let response = await admin.addType();

        let type = new TicketsController();
        let resp= await type.typesList();
        res.render('admin/type/index', { types: resp, image_base_url: '/image/' })
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/edit-type-id/:id', upload.single('images'), async (req, res) => {
    res.render(`admin/type/edit`, {b : {
        _id: req.params.id
    }})
});
router.put('/edit-type/:id',urlencodedParser, upload.none(), async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params, req.file);
        let response = await admin.editType();

        let type = new TicketsController();
        let resp= await type.typesList();
        res.render('admin/type/index', { types: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});
router.get('/delete-type/:id', async (req, res) => {
    try {
        let admin = new AdminController(req.body,req.params);
        let response = await admin.deleteType();
        
        let type = new TicketsController();
        let resp= await type.typesList();
        res.render('admin/type/index', { types: resp})
    } catch (error) { 
        res.status(error.statusCode || 500).send({ success: false, message: error.message});
    }
});


module.exports = router;
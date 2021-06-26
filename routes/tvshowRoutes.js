const express = require('express');
const router = express.Router();
const tvshows = require('../controllers/tvshowController');
const wrapAsync = require('../utils/wrapAsync');
const isLoggedIn = require('../middleware/isLoggedIn');

//GET - /tvshows
//render tvshow groups
router.get('/', wrapAsync(tvshows.index));

//GET - /tvshows/details/:tvshow_id
//render tvshow details
router.get('/details/:tvshow_id', wrapAsync(tvshows.details));

//GET - /tvshows/search
//render search page
router.get('/search', wrapAsync(tvshows.search));

//POST - /tvshows/watchlist/:tvshow_id
//add tvshow to wachlist
router.post('/watchlist/:tvshow_id', isLoggedIn, wrapAsync(tvshows.addToWatchlist));

//POST - /tvshows/favourites/:tvshow_id
//add tvshow to favourites
router.post('/favourites/:tvshow_id', isLoggedIn, wrapAsync(tvshows.addToFavourites));

module.exports = router;
const express = require('express');
const router = express.Router();
const films = require('../controllers/filmController');
const wrapAsync = require('../utils/wrapAsync');
const isLoggedIn = require('../middleware/isLoggedIn');

//GET - /films
//render film groups
router.get('/', wrapAsync(films.index));

//GET - /films/details/:film_id
//render film details
router.get('/details/:film_id', wrapAsync(films.details));

//GET - /films/search
//render search page
router.get('/search', wrapAsync(films.search));

//POST - /films/watchlist/:film_id
//add film to wachlist
router.post('/watchlist/:film_id', isLoggedIn, wrapAsync(films.addToWatchlist));

//POST - /films/favourites/:film_id
//add film to favourites
router.post('/favourites/:film_id', isLoggedIn, wrapAsync(films.addToFavourites));

module.exports = router;
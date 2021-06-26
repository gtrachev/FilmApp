const axios = require('axios');
const Genre = require('../models/GenreModel');
const User = require('../models/UserModel');
const AppError = require('../utils/AppError');
const returnCategory = require('../utils/returnCategory');
const api_key = process.env.TMDB_API_KEY;

//GET - /films
//render film groups
module.exports.index = async (req, res) => {
    const popularRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`)
    const popular = await returnCategory(popularRes.data.results);
    
    const upcomingRes = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=1`)
    const upcoming = await returnCategory(upcomingRes.data.results);

    const top_ratedRes = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=en-US&page=1`);
    const top_rated = await returnCategory(top_ratedRes.data.results);

    res.render('./main/index', { popular, upcoming, top_rated, isFilm: true, user: req.user });
}

//GET - /films/details/:film_id
//render film details
module.exports.details = async (req, res, next) => {
    try {
        const filmId = req.params.film_id;
    
        const filmRes = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${api_key}&language=en-US`);
        const film = filmRes.data;
        
        const filmCastRes = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}/credits?api_key=${api_key}&language=en-US`)
        const cast = filmCastRes.data.cast;
        
        const filmReviewRes = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}/reviews?api_key=${api_key}&language=en-US`)
        const reviews = filmReviewRes.data.results;
        
        const filmRecomRes = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}/recommendations?api_key=${api_key}&language=en-US`)
        const recommendations = await returnCategory(filmRecomRes.data.results);
    
        res.render('./main/details', { result: film, cast, reviews, recommendations, isFilm: true })
    } catch {
        next(new AppError('Film not found', '404', 'Could not find that film.'))
    }
}

//GET - /films/search
//render search page
module.exports.search = async (req, res) => {
    const searchQuery = req.query.search;
    const advancedQuery = req.query.advanced;

    if(searchQuery && searchQuery.length) {
        const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchQuery}&page=${req.query.page || 1}`);
        const foundFilms = await returnCategory(searchRes.data.results);
        const pageCount = searchRes.data.total_pages;
        return res.render('./main/search', { found: foundFilms, pageCount, searchQuery, advancedQuery: {genres: [''], vote: '', language: '', year: ''}, isFilm: true, pageQuery: req.query.page || 1 })
    }
    if(advancedQuery) {
        const { genres, vote, language, year, sort_by } = advancedQuery;
        const slectedGenres = genres.length ? genres.split(' ') : [''];
        const genreIds = await Promise.all(slectedGenres.map(async selectedGenre => {
            const genre = await Genre.findOne({name: selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)});
            if(genre) {
                return genre.id;
            }
            return '';
        }))
        const advancedRes = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=${sort_by || ''}&with_genres=${genreIds || ''}&vote_average.gte=${parseFloat(vote) || ''}&language=${language || ''}&year=${year || ''}&page=${req.query.page || 1}`);
        const foundFilms = await returnCategory(advancedRes.data.results);
        const pageCount = advancedRes.data.total_pages;

        return res.render('./main/search', { found: foundFilms, pageCount, searchQuery: '', advancedQuery, isFilm: true, pageQuery: req.query.page || 1 })
    }
    const searchRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${req.query.page || 1}`);
    const popularFilms = await returnCategory(searchRes.data.results);
    const pageCount = searchRes.data.total_pages;
    res.render('./main/search', { found: popularFilms, searchQuery, pageCount, advancedQuery: {genres: [''], vote: '', language: '', year: ''}, isFilm: true, pageQuery: req.query.page || 1 })
}

//POST - /films/favourites/:film_id
//add film to favourites
module.exports.addToWatchlist = async (req, res) => {
    const film_id = req.params.film_id;
    const user = await User.findById(req.user._id);
    if(user.film_watchlist.find(film => film === film_id)) {
        user.film_watchlist = user.film_watchlist.filter(film => {
            return parseInt(film) !== parseInt(film_id);
        })
        await user.save();
        req.flash('error', 'Film removed from watchlist.')
        return res.redirect(`/films/details/${film_id}`);
    }
    user.film_watchlist.push(film_id);
    await user.save();
    req.flash('success', 'Film added to watchlist')
    res.redirect(`/films/details/${film_id}`);
}

//POST - /films/favourites/:film_id
//add film to favourites
module.exports.addToFavourites = async (req, res) => {
    const film_id = req.params.film_id;
    const user = await User.findById(req.user._id);
    if(user.film_favourites.find(film => film === film_id)) {
        user.film_favourites = user.film_favourites.filter(film => {
            return parseInt(film) !== parseInt(film_id);
        })
        await user.save();
        req.flash('error', 'Film removed from favourites.')
        return res.redirect(`/films/details/${film_id}`);
    }
    user.film_favourites.push(film_id);
    await user.save();
    req.flash('success', 'Film added to favourites.')
    res.redirect(`/films/details/${film_id}`);
}
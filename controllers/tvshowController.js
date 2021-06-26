const axios = require('axios');
const returnCategory = require('../utils/returnCategory');
const AppError = require('../utils/AppError');
const Genre = require('../models/GenreModel');
const User = require('../models/UserModel');
const api_key = process.env.TMDB_API_KEY;

//GET - /tvshows
//render tvshows groups
module.exports.index = async (req, res) => {
    const popularRes = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&language=en-US&page=1`)
    const popular = await returnCategory(popularRes.data.results);

    const on_the_airRes = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${api_key}&language=en-US&page=1`)
    const onAir = await returnCategory(on_the_airRes.data.results);

    const top_ratedRes = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${api_key}&language=en-US&page=1`)
    const top_rated = await returnCategory(top_ratedRes.data.results);

    res.render('./main/index', { popular, onAir, top_rated, isFilm: false, user: req.user });
}

//GET - /tvshows/details/:tvshow_id
//render tvshow details
module.exports.details = async (req, res, next) => {
    try {
        const tvshowId = req.params.tvshow_id;
        
        const tvshowRes = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${api_key}&language=en-US`);
        const tvshow = tvshowRes.data;
        tvshow.title = tvshow.name;
        
        const tvCastRes = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${api_key}&language=en-US`)
        const cast = tvCastRes.data.cast;
        
        const tvReviewRes = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}/reviews?api_key=${api_key}&language=en-US`)
        const reviews = tvReviewRes.data.results;
        
        const tvRecomRes = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}/recommendations?api_key=${api_key}&language=en-US`)
        const recommendations = await returnCategory(tvRecomRes.data.results);

        res.render('./main/details', { result: tvshow, cast, reviews, recommendations, isFilm: false })    
    } catch {
        next(new AppError('Tvshow not found', '404', 'Could not find that tvshow.'))
    }
}

//GET - /tvshows/search
//render search page
module.exports.search = async (req, res) => {
    const searchQuery = req.query.search;
    const advancedQuery = req.query.advanced;

    if(searchQuery && searchQuery.length) {
        const searchRes = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${searchQuery}&page=${req.query.page || 1}`);
        const foundTvshows = await returnCategory(searchRes.data.results);
        const pageCount = searchRes.data.total_pages;
        return res.render('./main/search', { found: foundTvshows, pageCount, searchQuery, advancedQuery: {genres: [''], vote: '', language: '', year: ''}, isFilm: false, pageQuery: req.query.page || 1 })
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
        const advancedRes = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&sort_by=${sort_by || ''}&with_genres=${genreIds || ''}&vote_average.gte=${parseFloat(vote) || ''}&language=${language || ''}&first_air_date_year=${year || ''}&page=${req.query.page || 1}`);
        const foundTvshows = await returnCategory(advancedRes.data.results);
        const pageCount = advancedRes.data.total_pages;

        return res.render('./main/search', { found: foundTvshows, pageCount, searchQuery: '', advancedQuery, isFilm: false, pageQuery: req.query.page || 1 })
    }
    const searchRes = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${req.query.page || 1}`);
    const popularTvshows = await returnCategory(searchRes.data.results);
    const pageCount = searchRes.data.total_pages;

    res.render('./main/search', { found: popularTvshows, pageCount, searchQuery, advancedQuery: {genres: [''], vote: '', language: '', year: ''}, isFilm: false, pageQuery: req.query.page || 1 })
}

//POST - /tvshows/details/:tvshow_id
//add tvshow to watchlist
module.exports.addToWatchlist = async (req, res) => {
    const tvshow_id = req.params.tvshow_id;
    const user = await User.findById(req.user._id);
    if(user.tvshow_watchlist.find(tvshow => tvshow === tvshow_id)) {
        user.tvshow_watchlist = user.tvshow_watchlist.filter(tvshow => {
            return parseInt(tvshow) !== parseInt(tvshow_id);
        })
        await user.save();
        req.flash('error', 'TV-show removed from watchlist.')
        return res.redirect(`/tvshows/details/${tvshow_id}`);
    }
    user.tvshow_watchlist.push(tvshow_id);
    await user.save();
    req.flash('success', 'TV-show added to watchlist.')
    res.redirect(`/tvshows/details/${tvshow_id}`);
}

//POST - /tvshows/favourites/:tvshow_id
//add tvshow to favourites
module.exports.addToFavourites = async (req, res) => {
    const tvshow_id = req.params.tvshow_id;
    const user = await User.findById(req.user._id);
    if(user.tvshow_favourites.find(tvshow => tvshow === tvshow_id)) {
        user.tvshow_favourites = user.tvshow_favourites.filter(tvshow => {
            return parseInt(tvshow) !== parseInt(tvshow_id);
        })
        await user.save();
        req.flash('error', 'TV-show removed from favourites.')
        return res.redirect(`/tvshows/details/${tvshow_id}`);
    }
    user.tvshow_favourites.push(tvshow_id);
    await user.save();
    req.flash('success', 'TV-show added to favourites.')
    res.redirect(`/tvshows/details/${tvshow_id}`);
}
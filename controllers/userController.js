const User = require('../models/UserModel');
const axios = require('axios');
const api_key = process.env.TMDB_API_KEY;

//GET - /user/login
//render log in form
module.exports.renderLogin = (req, res) => {
    res.render('./user/login');
};

//GET - /user/register
//render register form
module.exports.renderRegister = (req, res) => {
    res.render('./user/register');
};

//GET - /user/account/:username
//render user page
module.exports.renderUserPage = async (req, res) => {
    const account = await User.findOne({username: req.params.username});
    const popularRes = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`);
    const popular = popularRes.data.results;
    const filmWatchlist = await Promise.all(account.film_watchlist.map(async film => {
        const watchlist = await axios.get(`https://api.themoviedb.org/3/movie/${film}?api_key=${api_key}&language=en-US`);
        return {
            id: watchlist.data.id,
            title: watchlist.data.title,
            poster: watchlist.data.poster_path,
            genres: watchlist.data.genres
        };
    }))
    const tvshowWatchlist = await Promise.all(account.tvshow_watchlist.map(async tvshow => {
        const watchlist = await axios.get(`https://api.themoviedb.org/3/tv/${tvshow}?api_key=${api_key}&language=en-US`);
        return {
            id: watchlist.data.id,
            title: watchlist.data.name,
            poster: watchlist.data.poster_path,
            genres: watchlist.data.genres
        };
    }))
    const filmFavourites = await Promise.all(account.film_favourites.map(async film => {
        const favourite = await axios.get(`https://api.themoviedb.org/3/movie/${film}?api_key=${api_key}&language=en-US`);
        return {
            id: favourite.data.id,
            title: favourite.data.title,
            poster: favourite.data.poster_path,
            genres: favourite.data.genres
        };
    }))
    const tvshowFavourites = await Promise.all(account.tvshow_favourites.map(async tvshow => {
        const favourite = await axios.get(`https://api.themoviedb.org/3/tv/${tvshow}?api_key=${api_key}&language=en-US`);
        return {
            id: favourite.data.id,
            title: favourite.data.name,
            poster: favourite.data.poster_path,
            genres: favourite.data.genres
        };
    }))
    
    res.render('./user/account', { account, popular, filmWatchlist, tvshowWatchlist, filmFavourites, tvshowFavourites });
};

//POST - /user/login
//log in user
module.exports.login = (req, res) => {
    const returnTo = req.session.returnTo || `/user/account/${req.user.username}`;
    delete req.session.returnTo;
    req.flash('success', `Welcome, ${req.user.username}!`);
    res.redirect(returnTo);
}

//POST - /user/register
//register user
module.exports.register = async (req, res) => {
    try {
        delete req.session.returnTo;
        const {username, email, password} = req.body;
        const user = new User({ username, email });
        //registrira usera
        const registeredUser = await User.register(user, password);
        //loginva go
        req.login(registeredUser, err => {
            if(err) return next(err);
            const returnTo = req.session.returnTo || `/user/account/${req.user.username}`;
            req.flash('success', 'Successfully registered.');
            res.redirect(returnTo);
        });
    } catch(e) {
        req.flash('error', e.name === 'UserExistsError' ? e.message : 'There was a problem creating your account');
        res.redirect('/user/register')
    }
}

//POST - /user/logout
//log out user
module.exports.logout = async (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out.')
    res.redirect('/films');
};
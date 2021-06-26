const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page.')
        res.redirect('/user/login');
    }
}

module.exports = isLoggedIn;
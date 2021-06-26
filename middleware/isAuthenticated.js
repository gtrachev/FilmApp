const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to access this page');
    res.redirect('/user/login');
}
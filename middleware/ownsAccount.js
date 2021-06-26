const AppError = require('../utils/AppError');

const ownsAccount = (req, res, next) => {
    if(req.user.username === req.params.username) {
        return next();
    }
    return next(new AppError('Page not found', '404', 'Could not find that page.'));
};

module.exports = ownsAccount;
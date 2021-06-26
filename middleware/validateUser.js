const { registerJoiSchema, loginJoiSchema } = require('../utils/joiValidation');

module.exports.validateRegister = (req, res, next) => {
    const err = registerJoiSchema.validate(req.body).error;
    if(err) {
        req.flash('error', 'There was a problem creating your acccount.');
        return res.redirect('/user/register');
    }
    next();
}

module.exports.validateLogin = (req, res, next) => {
    const err = loginJoiSchema.validate(req.body).error;
    if(err) {
        req.flash('error', 'There was a problem logging you in.');
        return res.redirect('/user/login');
    }
    next();
}
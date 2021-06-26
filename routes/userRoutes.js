const express = require('express');
const passport = require('passport');
const router = express.Router();
const user = require('../controllers/userController');
const wrapAsync = require('../utils/wrapAsync');
const isLoggedIn = require('../middleware/isLoggedIn');
const validateUser = require('../middleware/validateUser');
const ownsAccount = require('../middleware/ownsAccount');

//GET - /user/login
//render log in form
router.get('/login', user.renderLogin);

//GET - /user/register
//render register form
router.get('/register', user.renderRegister);

//GET - /user/account/:username
//render user page
router.get('/account/:username', ownsAccount, wrapAsync(user.renderUserPage));

//POST - /user/login
//log in user
router.post('/login', validateUser.validateLogin, passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: 'Invalid username or password.' }), user.login);

//POST - /user/register
//register user
router.post('/register', validateUser.validateRegister, wrapAsync(user.register));

//POST - /user/logout
//log out user
router.post('/logout', isLoggedIn, wrapAsync(user.logout));

module.exports = router;
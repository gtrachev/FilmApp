if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

//utils
const AppError = require('./utils/AppError');
const sessionConfig = require('./utils/SessionConfig');
const User = require('./models/UserModel');

//routes
const filmsRoutes = require('./routes/filmRoutes');
const tvshowRoutes = require('./routes/tvshowRoutes');
const userRoutes = require('./routes/userRoutes');

//Mongoose
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/filmapp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to database.'));

//EJS
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

//Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));

//Parse body
app.use(express.urlencoded({ extended: true }));

//Override method
app.use(methodOverride('_method'));

//Session configure
app.use(session(sessionConfig));

//Security
app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(helmet({
    contentSecurityPolicy: false
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.user;
    
    next();
})

//routers
app.use('/tvshows', tvshowRoutes);
app.use('/films', filmsRoutes);
app.use('/user', userRoutes);

app.all('*', (req, res, next) => {
    next(new AppError('Page not found', '404', 'Could not find that page.'));
})

app.use((err, req, res, next) => {
    res.status(parseInt(err.status) || 500).render('./utils/error', { err })
})

app.listen(3000, () => {
    console.log('Server running.')
})
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/filmapp';

const sessionStoreConfig = {
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
}

const sessionStore = MongoStore.create(sessionStoreConfig);

sessionStore.on('error', (e) => {
    console.log('SESSION STORE ERROR!')
})

const sessionConfig = {
    name: process.env.SESSION_SECRET || 'backup_secret',
    store: sessionStore,
    secret: 'secretone',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
} 

module.exports = sessionConfig;
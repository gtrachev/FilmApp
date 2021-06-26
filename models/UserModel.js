const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    film_watchlist: {
        type: [String],
        default: []
    },
    tvshow_watchlist: {
        type: [String],
        default: []
    },
    film_favourites: {
        type: [String],
        default: []
    },
    tvshow_favourites: {
        type: [String],
        default: []
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
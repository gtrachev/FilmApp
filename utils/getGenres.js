const Genre = require('../models/GenreModel');

const getGenres = async (genre_ids) => {
    const genres = await Promise.all(genre_ids.map(async id => {
        const genre = await Genre.findOne({id: id});
        return genre;
    }));
    return genres;
}

module.exports = getGenres;
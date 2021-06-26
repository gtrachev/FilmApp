const getGenres = require('./getGenres');

const returnCategory = async (categoryRes) => {
    const category = await Promise.all(categoryRes.map(async result => {
        const genres = await getGenres(result.genre_ids);
        return {
            title: result.title || result.name, 
            poster: result.poster_path,
            backdrop_path: result.backdrop_path,
            genres,
            id: result.id
        } 
    }));
    return category;
}

module.exports = returnCategory;
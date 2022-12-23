module.exports = {
    remove_duplicates(movies) {
    	return movies.filter((movies, index, self) => index === self.findIndex((t) => (t.id === movies.id)))
    }
}
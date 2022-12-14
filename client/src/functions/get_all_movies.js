import axios from "axios"

export const getMovies = async () => {
	console.log("Getting all users")
	let request = {
		url: "https://yts.torrentbay.to/api/v2/list_movies.json",
		method: "get",
		headers: {
			"Content-type"       : "application/json"
		},
        params: {
            page: 1
        }
	};

	const response = await axios(request);
	return response;
}
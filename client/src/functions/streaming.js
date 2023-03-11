import axios from "axios"


export const Get_torrents_for_movie = async(movie_id, token) => {
	console.log("Getting torrents: ", movie_id)
  let request = {
		url: `/api/torrents/get_list`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				       : `Bearer ${token}`
		},
    params: {
      movie_id: movie_id
    }
	};
	const response = await axios(request);
	console.log("Got torrents: ", response.data)
	return response;
}
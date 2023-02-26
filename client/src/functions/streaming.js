import axios from "axios"


export const Get_torrents_for_movie = async(movie_id, token) => {
	console.log("Getting torrents: ", movie_id)
  let request = {
		url: `http://127.0.0.1:8071/api/torrents/get_list`,
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

export const Add_magnet = async(hash, title, token) => {
	console.log("Adding magnet: ", hash, title)
  let request = {
		url: `http://127.0.0.1:8071/api/torrents/add_magnet`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				       : `Bearer ${token}`
		},
    data: JSON.stringify({
      hash : hash,
			title: title
    })
	};
	const response = await axios(request);
	console.log("magnet file content: ", response.data)
	return response;
}


export const get_ready_subs = async(hash, title, token) => {
	console.log("getting ready subs magnet: ", hash, title)
  let request = {
		url: `http://127.0.0.1:8071/api/torrents/subtitles/ready`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				       : `Bearer ${token}`
		},
    params: {
      hash : hash,
			title: title
    }
	};
	const response = await axios(request);
	console.log("got subs: ", response.data.subs)
	return response;
}


export const get_available_subs = async(hash, title, token) => {
	console.log("getting available subs magnet: ", hash, title)
  let request = {
		url: `http://127.0.0.1:8071/api/torrents/subtitles/available`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				       : `Bearer ${token}`
		},
    params: {
      hash : hash,
			title: title
    }
	};
	const response = await axios(request);
	console.log("got subs: ", response.data.subs)
	return response;
}
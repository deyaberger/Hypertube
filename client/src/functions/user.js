import axios from "axios"

export const Get_User_Details = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/me`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Is_Fav_Movie = async(token, movie_id) => {
	let request = {
		url : `http://127.0.0.1:8071/api/favorites/is_fav`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			"movie_id" : movie_id
		}
	}
	const response = await axios(request);
	return response;
}

export const Get_User_Fav_Movies = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/favorites/all`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}
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
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
}

export const Get_Other_User_Details = async(token, other_user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/profile/${other_user_id}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
	};
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
}


export const Update_First_Name = async(token, firstname) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/update_first_name`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			firstname : firstname
		}
	};
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
}


export const Update_Last_Name = async(token, lastname) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/update_last_name`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			lastname : lastname
		}
	};
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
}

export const Update_Bio = async(token, bio) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/update_bio`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			bio : bio
		}
	};
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
}

export const Update_Email = async(token, email) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/update_email`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			email : email
		}
	};
	try {
		const response = await axios(request);
		return response;
	}
	catch(e) {
		return (e.toJSON())
	}
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

export const Get_User_Fav_Movies = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/favorites/all`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			"user_id" : user_id
		}
	};
	const response = await axios(request);
	return response;
}

export const Get_Current_User_Fav_Movies_ID = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/favorites/all_ids`,
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

export const Get_Current_User_Watched_Movies_ID = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/watched_movies_id`,
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

export const Get_User_Watched_Movies = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/watched_movies`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		},
		params : {
			"user_id" : user_id
		}
	};
	const response = await axios(request);
	return response;
}

export const Remove_From_Favorites = async(movie_id, token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/favorites/remove/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}


export const Add_To_Favorites = async(movie_id, token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/favorites/add/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Set_Watched = async(movie_id, token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/set_watched/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Set_UnWatched = async(movie_id, token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/set_unwatched/${movie_id}`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
			'Authorization'				 : `Bearer ${token}`
		}
	};
	const response = await axios(request);
	return response;
}

export const Is_Watched = async(movie_id, token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/is_watched/${movie_id}`,
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


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

export const Get_User_Watched_Movies = async(token) => {
	let request = {
		url: `http://127.0.0.1:8071/api/user/watched_movies`,
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
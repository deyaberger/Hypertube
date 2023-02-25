import axios from "axios"

// ------------------------------------------ USER DETAILS -------------------------------------------------------------
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

// ------------------------------------------ FOLLOWS -------------------------------------------------------------
export const Get_User_Followings = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/follows/who_do_you_follow`,
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

export const Get_User_Followers = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/follows/who_follows_you`,
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


export const Is_Following = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/follows/is_following/${user_id}`,
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


export const Follow = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/follows/follow/${user_id}`,
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

export const UnFollow = async(token, user_id) => {
	let request = {
		url: `http://127.0.0.1:8071/api/follows/unfollow/${user_id}`,
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

// ------------------------------------------ IMAGE -------------------------------------------------------------
export const Upload_Image = async(token, image_file) => {
	const formData = new FormData()
	formData.append('file', image_file)
	let request = {
		url: `http://127.0.0.1:8071/api/image/upload`,
		method: "post",
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-type'				 : 'multipart/form-data',
			'Authorization'				 : `Bearer ${token}`
		},
		data : formData
	};
	const response = await axios(request);
	return response;
}
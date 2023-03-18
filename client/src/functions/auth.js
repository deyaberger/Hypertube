import axios from 'axios'

export const Get_Oauth_Urls = async function() {
	let request = {
		url: "/api/oauth/urls",
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
		}
	};
	let response = await axios(request);
	console.log(response)
	return response;
}

export const Sign_Up = async function(form) {
	let request = {
		url: "/api/auth/signup",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
			// 'Accept-Encoding': 'gzip, deflate, br',
		},
        data: JSON.stringify({
            "username"  : form.username,
            "firstName" : form.firstname,
            "lastName"  : form.lastname,
            "mail"      : form.email,
            "password"  : form.password,
        })
	};

	let response = await axios(request);
	return response;
}


export const Sign_In = async function(form) {
	let request = {
		url: "/api/auth/signin",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
			// 'Accept-Encoding': 'gzip, deflate, br',
		},
        data: JSON.stringify({
            "username"  : form.username,
            "password"  : form.password,
        })
	};

	let response = await axios(request);
	return response;
}


export const Request_Pass_Reset = async function(mail) {
	let request = {
		url: "/api/auth/request_pass_reset",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
			// 'Accept-Encoding': 'gzip, deflate, br',
		},
        params: {
			mail : mail
		}
	};

	let response = await axios(request);
	return response;
}


export const New_Pass = async function(hash, new_pwd) {
	let request = {
		url: "/api/auth/resetpass",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
			// 'Accept-Encoding': 'gzip, deflate, br',
		},
        params: {
			hash : hash,
			new_pwd : new_pwd
		}
	};

	let response = await axios(request);
	return response;
}

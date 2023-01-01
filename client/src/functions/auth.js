import axios from 'axios'

export const signup = async function(username, firstname, lastname, email, password) {
    console.log("Signin up")
	let request = {
		url: "http://127.0.0.1:8071/api/auth/signup",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
		},
        data: JSON.stringify({
            "username"  : username,
            "firstName" : firstname,
            "lastName"  : lastname,
            "mail"      : email,
            "password"  : password,
        })
	};

	let response = await axios(request);
	return response;
}


export const signin = async function(username, password) {
    console.log("Signin in")
	let request = {
		url: "http://127.0.0.1:8071/api/auth/signin",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
		},
        data: JSON.stringify({
            "username"  : username,
            "password"  : password,
        })
	};

	const response = await axios(request);
	return response;
}

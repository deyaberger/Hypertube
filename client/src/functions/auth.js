import axios from 'axios'

export const signup = async function(form) {
    console.log("Signin up : ", form)
	let request = {
		url: "http://127.0.0.1:8071/api/auth/signup",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
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


export const signin = async function(form) {
    console.log("Signin in")
	let request = {
		url: "http://127.0.0.1:8071/api/auth/signin",
		method: "POST",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type" : "application/json",
		},
        data: JSON.stringify({
            "username"  : form.username,
            "password"  : form.password,
        })
	};

	let response = await axios(request);
	return response;
}

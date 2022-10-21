let fake_back_res = function (form : object): object {
	const res = {
		"username" : "deya",
		"connection_error" : false
	}
	return res
}

let fake_back_res_sign_up = function (form : object): object {
	type Obj1 = {
		username : string;
		firstname : string;
		lastname : string;
		email : string;
		pwd : string;
		connection_error : boolean
	  };
	const res: Obj1 = {
		username : "dd",
		firstname : "deya",
		lastname : "berger",
		email : "deya@genial.com",
		pwd : "pwdrobuste",
		connection_error : false
	}
	return res
}

let check_sign_in_form = function (form: object): object {
	let fake_res_from_back = fake_back_res(form);
	let res = {
		"username" : fake_res_from_back.username,
		"connection_error" : fake_res_from_back.connection_error,
	}
	return res
};


let check_signup_form = function (form: object): object {
	const fake_res_from_back = fake_back_res_sign_up(form);
	let res = {
		"username" : fake_res_from_back.username,
		"firstname" : fake_res_from_back.firstname,
		"lastname" : fake_res_from_back.lastname,
		"email" : fake_res_from_back.email,
		"pwd" : fake_res_from_back.pwd,
		"username_error"  : false,
		"firstname_error" : false,
		"lastname_error"  : false,
		"email_error"     : false,
		"mdp_error"       : false,
		"connection_error" : fake_res_from_back.connection_error,
	}
	return res
};


// export default {check_sign_in_form, check_signup_form}
export default check_signup_form

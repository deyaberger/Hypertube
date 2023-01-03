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

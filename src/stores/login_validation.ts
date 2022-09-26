let fake_back_res = function (form : object): object {
	const res = {
		"username" : "deya",
		"connection_error" : false
	}
	return res
}

let check_form = function (form: object): object {
	let fake_res_from_back = fake_back_res(form);
	let res = {
		"username" : fake_res_from_back.username,
		"connection_error" : fake_res_from_back.connection_error,
	}
	return res
};

export default check_form
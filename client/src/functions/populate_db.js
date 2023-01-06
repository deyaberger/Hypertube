import axios from "axios"


// JUST A TEST
export const get_all_movies = async (source, page) => {
	console.log("Getting all movies from : ", source, ", page:", page);
	let request = {
		url: `http://127.0.0.1:8071/api/populate/fetch`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		},
        params: {
			"source" : source,
			"page"   : page,
		}
	};

	const response = await axios(request);
	return response;
}





// JUST A TEST
export const add_json_to_db = async (source, page) => {
	console.log("Getting all movies from : ", source, ", page:", page);
	let request = {
		url: `http://127.0.0.1:8071/api/populate/add_to_db`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		},
        params: {
			"source" : source,
			"page"   : page,
		}
	};

	const response = await axios(request);
	return response;
}

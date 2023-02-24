import axios from "axios"



// JUST A TEST
export const Get_All_Movies = async (source, page) => {
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
export const Dump_Json_To_DB = async (source, page) => {
	console.log("Getting all movies from : ", source, ", page:", page);
	let response = null;
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
	try {
		response = await axios(request);
	}
	catch(e) {
		console.log("Error: ", e);
	}
	return response;
}


export const Get_All_Movies_IMDB_Ids = async () => {
	let request = {
		url: `http://127.0.0.1:8071/api/populate/get_all_imdb_ids`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		}
	};

	const response = await axios(request);
	return response;
}

export const Fetch_And_Add_TMDB = async (imdb_code, id) => {
	console.log("IN FETCH AND ADD: ***********")
	let request = {
		url: `http://127.0.0.1:8071/api/populate/fetch_tmdb/${imdb_code}`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		},
		params : {
			'id' : id
		}
	};
	const response = await axios(request);
	return response
}
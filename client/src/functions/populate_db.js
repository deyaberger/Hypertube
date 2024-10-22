import axios from "axios"



// JUST A TEST
export const Get_All_Movies = async (source, page) => {
	console.log("Getting all movies from : ", source, ", page:", page);
	let request = {
		url: `/api/populate/fetch`,
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
	let request = {
		url: `/api/populate/add_to_db`,
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


export const Get_All_Movies_IMDB_Ids = async () => {
	let request = {
		url: `/api/populate/get_all_imdb_ids`,
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
	let request = {
		url: `/api/populate/fetch_tmdb/${imdb_code}`,
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


export const Opti_DB = async () => {
	let request = {
		url: `/api/populate/opti`,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json"
		}
	};
	const response = await axios(request);
	return response
}
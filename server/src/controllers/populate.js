const axios = require('axios')

const create_request = (url, params) => {
	let request = {
		url: url,
		method: "get",
		headers: {
			'Access-Control-Allow-Origin': '*',
			"Content-type"               : "application/json",
		},
		params: params
	}
	return request;
}

module.exports = (db_pool) => {
    return {

		search_all_movies : async (source, page_nb) => {
			let url = null;
            let response = null;
			if (source == "yts") {
                console.log("Fetching movies from YTS, page:", page_nb)
				url = "https://yts.torrentbay.to/api/v2/list_movies.json"
            }
            var fs = require('fs');
            let request = create_request(url, {"page" : page_nb});
            try {
                response = await axios(request);
                response = response.data.data;
                var file_path = "./src/yts_response/yts_page" + page_nb + ".json"
                fs.writeFile(file_path, JSON.stringify(response), function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            catch(e) {
                let data_to_append = JSON.stringify({"page_nb" : page_nb, "type" : "req error", "msg" : e, "res" : response})
                fs.appendFile('./src/yts_response/log.txt', data_to_append, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            }

            return (response)
        },



        put_json_to_db : (source, page_nb) => {
            let prefix = null;
            let data = null;
            var fs = require('fs');
			if (source == "yts") {
                console.log("Adding data to DB, page:", page_nb)
				prefix = "./src/yts_response/yts_page"
                file_path = prefix + page_nb + ".json"
                fs.readFile(file_path, 'utf8', function(err, data){
                        data = JSON.parse(data)
                        console.log("DATA read from file: ", data)
                });
            }
            return (data)
        }

    }
}
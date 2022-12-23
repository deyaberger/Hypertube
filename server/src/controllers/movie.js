const axios = require('axios')

module.exports = (db_pool) => {
    return {
        get_movie_by_yts_id: async (yts_movie_id) => {
            console.log("Getting specific movie")
            let request = {
                url: "https://yts.torrentbay.to/api/v2/movie_details.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type" : "application/json",
                },
                params: {
                    "movie_id"    : yts_movie_id,
                    "with_images" : true,
                    "with_cast"   : true,
                }
            };
        
            const response = await axios(request);
            return response;
        },

        
        get_movies_homepage: async (page, limit) => {
            console.log("Getting list of movies");
            let request = {
                url: "https://yts.torrentbay.to/api/v2/list_movies.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type"               : "application/json",
                    "Accept-Encoding"            : "gzip,deflate,compress"
                },
                params: {
                    "page"  : page,
                    "limit" : limit,
                }
            };
        
            const response = await axios(request);
            return response.data.data;
        },


        search_movies : async (query_term, minimum_rating, genre, quality, sort_by, page, limit, order_by) => {
            console.log("Searching movies with params:\n",
            {
                "page"           : page,
                "minimum_rating" : minimum_rating,
                "query_term"     : query_term,
                "genre"          : genre,
                "sort_by"        : sort_by,
                'quality'        : quality,
                'order_by'       : order_by,
                "limit"          : limit,
            });

            let request = {
                url: "https://yts.torrentbay.to/api/v2/list_movies.json",
                method: "get",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-type" : "application/json",
                },
                params: {
                    "page"           : page,
                    "minimum_rating" : minimum_rating,
                    "query_term"     : query_term,
                    "genre"          : genre,
                    "sort_by"        : sort_by,
                    'quality'        : quality,
                    'order_by'       : order_by,
                    "limit"          : limit,
                }
            };
            const response = await axios(request);
            return response;
        }
    }
}
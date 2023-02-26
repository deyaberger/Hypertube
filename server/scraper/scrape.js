const axios = require('axios');
const { secureHeapUsed } = require('crypto');
const fs = require('fs')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function to_skip(movies_titles, movie_ids, i) {
    if (movies_titles[i] == undefined || fs.existsSync(`./data/success/${movie_ids[i]}_${movies_titles[i]}.json`) || fs.existsSync(`./data/no_result/${movie_ids[i]}_${movies_titles[i]}.json`)) {
        if (fs.existsSync(`./data/no_result/${movie_ids[i]}_${movies_titles[i]}.json`)) {
            console.log("skipping: ", movies_titles[i], 'No results, unpopular.')
        }
        if (movies_titles[i] != undefined) {
            console.log("skipping: ", movies_titles[i], 'already scraped')
        }
        return true
    }
    return false
}

function write_response_to_file(response, movies_titles, movie_ids, i) {
    if (response.data.data == undefined) {
        fs.writeFileSync(`./data/no_result/${movie_ids[i]}_${movies_titles[i]}.json`, JSON.stringify({"failed": "failed"}) , 'utf-8');
        console.log("nay")
    }
    else if (response.data.data[0].name != undefined && response.data.data[0].size != undefined) {
        fs.writeFileSync(`./data/success/${movie_ids[i]}_${movies_titles[i]}.json`, JSON.stringify(response.data.data, null, 2) , 'utf-8');
        console.log("yay")
    }
    else {
        fs.writeFileSync(`./data/fail/${movie_ids[i]}_${movies_titles[i]}.json`, JSON.stringify({"failed":'failed'}) , 'utf-8');
        fs.writeFileSync(`./data/fail/${movie_ids[i]}_${movies_titles[i]}_data.json`, JSON.stringify(response.data.data, null, 2) , 'utf-8');
        console.log("fuck")
    }
}


async function get_movies_from_home_api(movies_titles, movie_years, movie_ids, sites) {
    let responses = []
    let website_index = 0
    let consecutive_blocks = []
    for (let i =0; i < sites.length; i++) {
        consecutive_blocks.push(0)
    }
    for (let i =0; i <= movies_titles.length; i++) {
        console.log("")
        let request = {
            url: 'http://localhost:8080/api/v1/search',
            method: "get",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-type" : "application/json",
            },
            params: {
                "query" : `${movies_titles[i]} ${movie_years[i]} (${movie_years[i]})`,
                "site" : sites[website_index],
                "limit": 5
            }
        };
        if (!to_skip(movies_titles, movie_ids, i)) {
            process.stdout.write(`${movies_titles[i]} ${movie_years[i]} ${sites[website_index]}        `)
            try {
                const response = await axios(request);
                responses.push(response)

                if (response.data.error != 'website blocked change ip or domain') {
                    write_response_to_file(response, movies_titles, movie_ids, i)
                    consecutive_blocks[website_index] = 0
                }
                else {
                    console.log("\n\nBLOCKED ON: ", sites[website_index])
                    consecutive_blocks[website_index] += 1
                    console.log("CONSECUTIVE BLOCKS = ", consecutive_blocks[website_index], consecutive_blocks)

                    if (consecutive_blocks.every((val) => val > 6)) {
                        console.log("\n\nABORTING WE'VE BEEN DETECTED")
                        return 'DETECTED'
                    }
                }
                website_index += 1
                website_index = website_index % sites.length
                if (consecutive_blocks[website_index] != 0) {
                    let date = Date.now();
                    await sleep(40000 * consecutive_blocks[website_index] * consecutive_blocks[website_index])
                    let currentDate = Date.now();
                    console.log("waited: ", (currentDate - date ) / 1000, "seconds not to get BLACKLISTED for scraping.");
                }
            }
            catch (e) {
                console.log("giga fuck")
                console.log(e)
                console.log("\ngiga fuck\n")

            }
            if (sites[website_index] == 'kickass') {
                await sleep(50000)
            }
            else {
                await sleep(30000)
            }
    }
}
    // console.log(responses)
    return Promise.all(responses);
}

async function read_files_and_get_movies(movies_titles, movie_years) {

    // sites = ['bitsearch', 'kickass']
    sites = ['bitsearch', 'kickass']

    for (let i =1; i <= 1000; i++) {
        if (!fs.existsSync(`../yts_response/yts_page${i}.json`)) {
            console.log("NODILEKL")
            break
        }
        console.log("Reading file: ", `../yts_response/yts_page${i}.json`)
        data = require(`../yts_response/yts_page${i}.json`)

        movies_titles = data.movies.map((movie) => movie.title)
        movie_years   = data.movies.map((movie) => movie.year)
        movie_ids     = data.movies.map((movie) => movie.id)

        let detected = await get_movies_from_home_api(movies_titles, movie_years, movie_ids, sites)
        if (detected == 'DETECTED') {
            console.log("RUN FOR THE HILLS")
            break
        }
    }

}

read_files_and_get_movies()
import EventEmitter from 'events'

import { Get_Movies_Research_Page, Get_Recommendations_Page} from "./movies"


class Paginator extends EventEmitter {
    constructor(user_token) {
      super()

      this.movies_per_page = 24
      this.user_token = user_token
      this.search_form = null
      this.error = false
      this.movies = {}
      this.current_page_movies = []
      this.current_page = 0
      this.loading = true
    }

    get_min_page() {
      return Math.max(0, this.current_page - 4)
    }

    get_max_page() {
      let max_loaded = Math.max(Object.keys(this.movies))
      return Math.min(max_loaded, this.current_page + 4)
    }

    set_page(page_number) {
      console.log("set page number", page_number)
      this.current_page = page_number
      this.loading = true

      let min = Math.max(0, this.page_number - 4)
      let max = this.current_page

      for (const i = min; i <= max; i++) {
        console.log("handling", i)
        if (!i in this.movies) {
          console.log("no cache")
          let new_movies = this.get_page_from_server(page_number)
          console.log("new mov", new_movies)
          if (new_movies.length == 0) {
            break
          }
          this.movies[page_number] = new_movies
        }
      }
      this.movies = [...this.movies]
      this.loading = false
    }

    set_search_form(form) {
      this.search_form = form
    }

    get_page(page_number) {
      console.log("Getting page", page_number)
      if (! page_number in this.movies) {
        console.log("cache hit")
      }
      else {
        console.log("fetching from api")
        this.movies[page_number] = this.get_page_from_server(page_number)
      }
      return this.movies[page_number]
    }

    async get_page_from_server(page_number) {
      try {
        let res
        if (this.search_form == null) {
          console.log("recommendcations")
          res = await Get_Recommendations_Page(this.user_token, page_number * this.movies_per_page, this.movies_per_page);
        }
        else {
          console.log("search")
          res = await Get_Movies_Research_Page(this.form, this.lang_nb, this.user_token, page_number * this.movies_per_page, this.movies_per_page);
        }
        if (res && res.data && res.data.code == 'SUCCESS') {
          return res.data.movies
        }
        throw(new Error("Search movies error"))
      }
      catch(e) {
        this.error = true
        if (e.code == 'ERR_BAD_REQUEST') { // i.e. it's an axios error
          if (e.response && e.response.status == 401)  {
            this.emit('GET_MOVIE_ERROR')
          }
        }
        console.log("UNKNOWN ERROR [get_reco]: ", Object.keys(e), e.code, e.name, e.response)
        throw(e)
        this.emit('GET_MOVIE_ERROR')
      }
    }
  }
export default Paginator;


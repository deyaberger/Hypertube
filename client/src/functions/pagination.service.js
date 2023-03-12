import { BIconHandThumbsUpFill } from 'bootstrap-icons-vue'
import EventEmitter from 'events'

import { Get_Movies_Research_Page, Get_Recommendations} from "./movies"

let page_range = 4

class Paginator extends EventEmitter {
    constructor(user_token, lang_nb, perPage) {
      super()

      this.movies_per_page = perPage
      this.user_token = user_token
      this.lang_nb = lang_nb
      this.fresh_state()
      this.get_reco()
    }

    fresh_state() {
      this.loading_search      = false
      this.loading_reco        = true
      this.search_form         = null
      this.searched_movies     = {}
      this.current_page        = 0
      this.recommendations     = []
      this.search_form = {"title":"","min_rating":0,"genre":"Action","quality":"","min_year":1900,"sort_by":"title","asc_or_desc":"asc"}
    }

    get_min_page() {
      // Min page to display for nav
      return Math.max(0, this.current_page - 4)
    }

    get_max_page() {
      // Max page to display for nav
      let max_loaded = Math.max(Object.keys(this.searched_movies))
      return Math.min(max_loaded, this.current_page + 4)
    }

    async set_page(page_number) {
      console.log("set page number", page_number)
      this.current_page   = page_number
      this.loading_search = true

      let min = Math.max(1, page_number - page_range)
      let max = this.current_page + page_range
      console.log("min", min, 'max', max)

      for (let i = min; i <= max; i++) {
        console.log("handling", i)
        if (!(i in Object.keys(this.searched_movies))) {
          console.log("no cache")
          let new_movies = await this.get_page_from_server(page_number)
          console.log("new mov", new_movies)
          if (new_movies.length == 0) {
            break
          }
          this.searched_movies[page_number] = new_movies
        }
        else {
          console.log(i, 'in movies', Object.keys(this.searched_movies))
        }
      }
      this.current_page_movies = [...this.searched_movies[page_number]]
      this.searched_movies = {...this.searched_movies}
      this.loading_search = false
    }

    set_search_form(form) {
      console.log("setting form", form)
      this.fresh_state()
      this.search_form = form
      this.set_page(0)
    }

    async get_reco() {
      try {
        let res
        this.loading_reco = true
        console.log("recommendcations")
        res = await Get_Recommendations(this.user_token);
        if (res && res.data && res.data.code == 'SUCCESS') {
          console.log("GOT RECO:", res.data.movies)
          this.recommendations = res.data.movies
          this.recommendations = [...this.recommendations]
          this.loading_reco = false
          return
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

    async get_page_from_server(page_number) {
      try {
        let res
        console.log("search", this.search_form, this.lang_nb, this.user_token, page_number * this.movies_per_page, this.movies_per_page )
        res = await Get_Movies_Research_Page(this.search_form, this.lang_nb, this.user_token, page_number * this.movies_per_page, this.movies_per_page);

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
        console.log("UNKNOWN ERROR [search pagi]: ", Object.keys(e), e.code, e.name, e.response)
        throw(e)
        this.emit('GET_MOVIE_ERROR')
      }
    }
  }
export default Paginator;


// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user_connected : false,
      username: '',
      username_error : false,
      firstname: '',
      firstname_error : false,
      lastname: '',
      lastname_error : false,
      email: '',
      email_error : false,
      password: '',
      connection_error : false,
      wesh: "heyyy"
    }
  },
  mutations: {
    SET_USERNAME(state, username) {
      state.username = username
    },
    SET_WESH(state, wesh) {
      state.wesh = wesh
    }
  }
})

export default store

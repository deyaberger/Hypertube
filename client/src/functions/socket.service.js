import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {

    }
  
    setupSocketConnection(token) {
      console.log("socket connect", token)
      this.socket = io("http://localhost:5173", {
        path: "/socketo/",
        auth: {
            token: token
          }
      });
      console.log("SUUUCCEEEE", this.socket)
    }

    bindSocketToStore(store) {
      console.log("binding", socket)
    }
  }
  
  export default new SocketioService();
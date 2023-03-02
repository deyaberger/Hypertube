import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {

    }
  
    setupSocketConnection() {
      console.log("socket connect")
      this.socket = io("http://localhost:5173", {
        path: "/socketo/",
        auth: {
            token: "abc"
          }
      });
      console.log("SUUUCCEEEE", this.socket)
    }
  }
  
  export default new SocketioService();
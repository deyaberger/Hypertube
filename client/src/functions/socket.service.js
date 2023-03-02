import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {

    }
  
    setupSocketConnection() {
      this.socket = io("http://localhost:5173", {
        path: "/my-custom-path/"
      });
      console.log("SUUUCCEEEE", this.socket)
    }
  }
  
  export default new SocketioService();
import { io, Socket } from "socket.io-client";

class SocketInstance {
  private static instance: SocketInstance;
  public socket: Socket;

  private constructor() {
    this.socket = io("http://localhost:8090");
  }

  public static getInstance(): SocketInstance {
    if (!SocketInstance.instance) {
      SocketInstance.instance = new SocketInstance();
    }
    return SocketInstance.instance;
  }
}

export default SocketInstance;

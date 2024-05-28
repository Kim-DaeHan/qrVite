import { io } from 'socket.io-client';

import type { Socket } from 'socket.io-client';

class SocketInstance {
  private static instance: SocketInstance;
  public socket: Socket;

  private constructor() {
    this.socket = io('http://159.138.233.132:8080');
  }

  public static getInstance(): SocketInstance {
    if (!SocketInstance.instance) {
      SocketInstance.instance = new SocketInstance();
    }
    return SocketInstance.instance;
  }
}

export default SocketInstance;

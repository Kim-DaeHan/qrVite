import SocketInstance from './socketInstance';

class SocketService {
  private socketInstance: SocketInstance;

  constructor() {
    this.socketInstance = SocketInstance.getInstance();
  }

  public joinRoom(roomId: string) {
    this.socketInstance.socket.emit('joinRoom', roomId);
  }

  public leaveRoom(roomId: string) {
    this.socketInstance.socket.emit('leaveRoom', roomId);
  }

  public sendMessageToRoom(roomId: string, message: string) {
    this.socketInstance.socket.emit('message', roomId, message);
  }

  public sendVerifyResult(roomId: string, message: boolean) {
    this.socketInstance.socket.emit('verify', roomId, message);
  }

  public onMessageReceived(type: string, callback: (message: any) => void) {
    if (type === 'message') {
      this.socketInstance.socket.on('message', (message: any) => {
        callback(message);
      });
    } else if (type === 'cryptoInfo') {
      this.socketInstance.socket.on('cryptoInfo', (message: any) => {
        callback(message);
      });
    } else if (type === 'encryptedMessage') {
      this.socketInstance.socket.on('encryptedMessage', (message: any) => {
        callback(message);
      });
    }
  }

  public offMessageReceived(type: string) {
    if (type === 'message') {
      this.socketInstance.socket.off('message');
    } else if (type === 'cryptoInfo') {
      this.socketInstance.socket.off('cryptoInfo');
    } else if (type === 'encryptedMessage') {
      this.socketInstance.socket.off('encryptedMessage');
    }
  }
}

export default new SocketService();

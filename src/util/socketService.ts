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

  public sendMessage(roomId: string, message: string) {
    const result = this.socketInstance.socket.emit('sendMessage', roomId, message);
    return result;
  }

  public onMessageReceived(type: string, callback: (message: any) => void) {
    if (type === 'cryptoInfo') {
      this.socketInstance.socket.on('cryptoInfo', (message: any) => {
        callback(message);
      });
    } else if (type === 'requestMessage') {
      this.socketInstance.socket.on('requestMessage', (message: any) => {
        callback(message);
      });
    }
  }

  public offMessageReceived(type: string) {
    if (type === 'cryptoInfo') {
      this.socketInstance.socket.off('cryptoInfo');
    } else if (type === 'requestMessage') {
      this.socketInstance.socket.off('requestMessage');
    }
  }
}

export default new SocketService();

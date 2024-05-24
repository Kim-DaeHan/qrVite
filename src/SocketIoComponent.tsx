import { useState, useEffect } from 'react';
import SocketService from './util/socketService.ts';
import login from './util/login.ts';
import { QRCodeCanvas } from 'qrcode.react';
import { AccountType } from './util/types';

interface socketFace {
  qrCode: string;
  roomId: string;
  secretKey: string;
  sigMessage: string;
}
function SocketIoComponent({ qrCode, roomId, secretKey, sigMessage }: socketFace) {
  const [sendMessage, setSendMessage] = useState<string>('');
  const [account, setAccount] = useState<AccountType>();

  useEffect(() => {
    const getAccount = async () => {
      const loginAccount = await login.loginExchange(roomId, secretKey, sigMessage);
      setAccount(loginAccount);
    };
    getAccount();
  }, [roomId, secretKey, sigMessage]);

  useEffect(() => {
    console.log('account: ', account);
  }, [account]);

  const handleSendMessage = () => {
    SocketService.sendMessageToRoom(roomId, sendMessage);
    setSendMessage('');
  };

  const handleLeaveRoom = () => {
    SocketService.leaveRoom(roomId);
    console.log(`leave room: ${roomId}`);
  };

  return (
    <div className='App'>
      <h1>여기는 DAPP</h1>
      <QRCodeCanvas value={qrCode} />
      <p>{qrCode}</p>
      <input type='text' value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} placeholder='Message' />
      <button onClick={handleSendMessage}>Send Message</button>

      <button onClick={handleLeaveRoom}>Leave Room</button>
    </div>
  );
}

export default SocketIoComponent;

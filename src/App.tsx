import QR from './util/login.ts';
import './App.css';
import SocketIoComponent from './SocketIoComponent.tsx';

function App() {
  const { qrCode, roomId, secretKey, sigMessage } = QR.generateQrCode('login', 'Welcome to Dapp');

  console.log('qrCode: ', qrCode);
  console.log('roomId: ', roomId);
  console.log('secretKey: ', secretKey);
  console.log('message: ', sigMessage);

  return (
    <div>
      <SocketIoComponent qrCode={qrCode} roomId={roomId} secretKey={secretKey} sigMessage={sigMessage} />
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import login from './util/login.ts';
import QR from './util/login.ts';
import { QRCodeCanvas } from 'qrcode.react';
import { AccountType } from './util/types.ts';

interface Result {
  message: string;
  address?: AccountType;
}

interface QrProps {
  type: string;
  sigMessage: string;
  did: (result: Result) => Result;
}
function LoginQRComponent({ type, sigMessage, did }: QrProps) {
  const { qrCode, roomId } = QR.generateQrCode(type);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const loginAccount = await login.qrLogin(roomId, sigMessage);
        console.log('account: ', loginAccount);
        const result = {
          message: 'success',
          address: loginAccount,
        };
        did(result);
      } catch (error) {
        const result = {
          message: 'false',
        };
        did(result);
        console.log('qr errer: ', error);
      }
    };
    getAccount();
  }, [did, roomId, sigMessage]);

  return (
    <div className='App'>
      <QRCodeCanvas value={qrCode} />
      <p>{qrCode}</p>
    </div>
  );
}

export default LoginQRComponent;

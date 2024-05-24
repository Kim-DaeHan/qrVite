import { QRCodeCanvas } from 'qrcode.react';

type QRProps = {
  data: string;
};

function QRCodeComponent({ data }: QRProps) {
  return (
    <div>
      <QRCodeCanvas value={data} />
    </div>
  );
}

export default QRCodeComponent;

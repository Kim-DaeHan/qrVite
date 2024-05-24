import CryptoJS from 'crypto-js';
import { useState } from 'react';
import base64 from 'base-64';
import { ec as EC } from 'elliptic';

function generateKeys() {
  const ec = new EC('secp256k1');
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');

  return {
    privateKey,
    publicKey,
  };
}

function sign(msg: string, prKey: string) {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPrivate(prKey, 'hex');
  // const encrypted = key.encrypt(msg);
  const encrypted = ec.sign(msg, key);
  return encrypted;
}

function verify(msg: string, sig: EC.Signature, pubKey: string) {
  const ec = new EC('secp256k1');
  const key = ec.keyFromPublic(pubKey, 'hex');
  // const encrypted = key.encrypt(msg);
  const decrypted = ec.verify(msg, sig, key);
  return decrypted;
}

function encrypt(text: string, key: string) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

function decrypt(encryptedText: string, key: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

function isJwtToken(tokenString: string) {
  const tokenParts = tokenString.split('.');
  return tokenParts.length === 3;
}

function signMessage(message: string, key: string) {
  const hash = CryptoJS.SHA256(message + 'zigap').toString(CryptoJS.enc.Hex);
  console.log('hash: ', hash);
  const sign = encrypt(hash, key);
  return sign;
}

function WebSocketComponent() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const sessionKey = '103a4081d986d570e28e1bc35d53cc93';
  const secretKey = '0ff85630d16c9ffd03ae8d8ab92fda302994e24e2801fb99431bdf13ce5160ab';

  // 웹 소켓 연결 함수
  function connectWebSocket() {
    const serverUrl = 'ws://localhost:7070'; // 웹 소켓 서버 주소
    const newSocket = new WebSocket(serverUrl, sessionKey);

    // 연결 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setSocket(newSocket);
    };

    // 메시지 수신 이벤트 핸들러
    newSocket.onmessage = (event) => {
      console.log('Received message:', event.data);
      console.log('Received message 길이:', event.data.length);
      const decryptMsg = decrypt(event.data, secretKey);
      console.log('decrypt: ', decryptMsg);
      // 토큰 수신 시
      if (isJwtToken(decryptMsg)) {
        const token = decryptMsg;
        const payload = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'));
        const dec = base64.decode(payload);
        console.log('payload: ', dec);
        localStorage.setItem('user', token);
        const message = 'sign';
        const encryptMsg = encrypt(message, secretKey);
        newSocket.send(encryptMsg);
        console.log('Sent message:', encryptMsg);
      } else {
        const sign = signMessage(decryptMsg, secretKey);
        console.log('sign', sign);
        newSocket.send(sign);
        console.log('Sent message:', sign);
      }
    };

    // 연결 종료 이벤트 핸들러
    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };
  }

  // 메시지 전송 함수
  function sendMessage() {
    if (socket) {
      const message = 'cd32734211d10abaab69d2d7cee927b09b15b5bbb52b';
      const encryptMsg = encrypt(message, secretKey);
      socket.send(encryptMsg);
      console.log('Sent message:', encryptMsg);
    }
  }

  // 연결 종료 함수
  function disconnectWebSocket() {
    if (socket) {
      socket.close();
    }
  }

  const { privateKey, publicKey } = generateKeys();
  console.log('test222: ', privateKey, publicKey);
  const msg = 'hello hans';
  const sig = sign(msg, privateKey);
  const decMsg = verify(msg, sig, publicKey);

  console.log('sig: ', sig);
  console.log('decMsg: ', decMsg);
  return (
    <div>
      <button onClick={connectWebSocket}>Connect</button>
      <button onClick={sendMessage} disabled={!socket}>
        Send Message
      </button>
      <button onClick={disconnectWebSocket} disabled={!socket}>
        Disconnect
      </button>
    </div>
  );
}

export default WebSocketComponent;

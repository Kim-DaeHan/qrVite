import SocketService from './socketService';
import CryptoJS from 'crypto-js';
import cryptoUtils from './cryptoUtils';
import { CryptoInfoType, AccountType, QrType, SignatureType } from './types';

class LoginService {
  // 타입 가드 함수
  private isCryptoInfoType(obj: any): obj is CryptoInfoType {
    return (
      typeof obj === 'object' && obj !== null && this.isSignature(obj.signature) && typeof obj.publicKey === 'string'
    );
  }

  private isSignature(obj: any): obj is SignatureType {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.r === 'string' &&
      typeof obj.s === 'string' &&
      (typeof obj.recoveryParam === 'number' || obj.recoveryParam === null)
    );
  }

  private isAccountType(obj: any): obj is AccountType {
    return typeof obj === 'object' && obj !== null && typeof obj.address === 'string';
  }

  // string으로 넘어오는 경우 객체로 바꿔서 타입 체크할 경우 사용
  // ex) if (this.isJsonStringOfType<CryptoInfoType>(message, this.isCryptoInfoType)) {
  // private isJsonStringOfType<T>(str: string, isOfType: (obj: any) => obj is T) {
  //   try {
  //     const obj = JSON.parse(str);
  //     return isOfType(obj);
  //   } catch (e) {
  //     return false;
  //   }
  // }

  public generateQrCode(type: string, sigMessage: string): QrType {
    const roomId = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    const secretKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

    let qrCode = '';
    if (type === 'login') {
      qrCode = `Login://login?roomId=${roomId}&secretKey=${secretKey}&message=${sigMessage}&type=${type}`;
    } else if (type === 'send') {
      qrCode = `Send://send?roomId=${roomId}&secretKey=${secretKey}&message=${sigMessage}&type=${type}`;
    }

    SocketService.joinRoom(roomId);

    return {
      qrCode,
      roomId,
      secretKey,
      sigMessage,
    };
  }

  public loginVerify(roomId: string, message: string, signature: SignatureType, publicKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const verified = cryptoUtils.verify(message, signature, publicKey);
      console.log('verified: ', verified);
      SocketService.sendVerifyResult(roomId, verified);
      if (verified) {
        resolve();
      } else {
        reject(new Error('Verification failed'));
      }
    });
  }

  public getCryptoInfo(): Promise<CryptoInfoType> {
    return new Promise((resolve, reject) => {
      SocketService.onMessageReceived('cryptoInfo', (message: any) => {
        if (this.isCryptoInfoType(message)) {
          resolve(message);
        } else {
          reject(new Error('Invalid crypto info'));
        }
      });
    });
  }

  public getAccount(secretKey: string): Promise<AccountType> {
    return new Promise((resolve, reject) => {
      SocketService.onMessageReceived('encryptedMessage', (message: any) => {
        if (this.isAccountType(message)) {
          const address = cryptoUtils.decrypt(message.address, secretKey);
          if (address) {
            message.address = address;
          }
          resolve(message);
        } else {
          reject(new Error('Invalid account info'));
        }
      });
    });
  }

  public async loginExchange(roomId: string, secretKey: string, message: string): Promise<AccountType> {
    try {
      const { publicKey, signature } = await this.getCryptoInfo();
      SocketService.offMessageReceived('cryptoInfo');
      await this.loginVerify(roomId, message, signature, publicKey);
      const account = await this.getAccount(secretKey);

      return account;
    } catch (error) {
      console.log('error: ', error);
      return Promise.reject(error);
    } finally {
      SocketService.leaveRoom(roomId);
    }
  }
}

export default new LoginService();

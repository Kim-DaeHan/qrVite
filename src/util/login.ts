import CryptoJS from 'crypto-js';

import cryptoUtils from './cryptoUtils';
import SocketService from './socketService';

import type { AccountCryptoType, AccountType, QrType, SignatureType } from './types';

class LoginService {
  // 타입 가드 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isAccountCryptoType(obj: any): obj is AccountCryptoType {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.signature === 'string' &&
      typeof obj.publicKey === 'string' &&
      typeof obj.address === 'string' &&
      typeof obj.etc === 'string'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isSignature(obj: any): obj is SignatureType {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.r === 'string' &&
      typeof obj.s === 'string' &&
      (typeof obj.recoveryParam === 'number' || obj.recoveryParam === null)
    );
  }

  // private isAccountType(obj: any): obj is AccountType {
  //   return typeof obj === 'object' && obj !== null && typeof obj.address === 'string';
  // }

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

  public generateQrCode(type: string): QrType {
    const roomId = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    // const secretKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

    let qrCode = '';
    if (type === 'login') {
      qrCode = `zigap://login?roomId=${roomId}&type=${type}`;
    } else if (type === 'send') {
      qrCode = `zigap://send?roomId=${roomId}&type=${type}`;
    }

    SocketService.joinRoom(roomId);

    return {
      qrCode,
      roomId,
    };
  }

  public getAccountCrypto(): Promise<AccountCryptoType> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      SocketService.onMessageReceived('accountInfo', (message: any) => {
        if (this.isAccountCryptoType(message)) {
          resolve(message);
        } else {
          reject(new Error('Invalid account crypto'));
        }
      });
    });
  }

  public reciveRequest(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      SocketService.onMessageReceived('requestMessage', (message: any) => {
        if (message === 'Request Message') {
          resolve(true);
        } else {
          reject(new Error('Request message is different'));
        }
      });
    });
  }

  public sendMessage(roomId: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = SocketService.confirmMessage(roomId, message);
      if (result.connected) {
        resolve();
      } else {
        reject(new Error('Send failed'));
      }
    });
  }

  public async qrLogin(roomId: string, message: string): Promise<AccountType> {
    try {
      const requestReceived = await this.reciveRequest();

      if (requestReceived) {
        await this.sendMessage(roomId, message);
        const { publicKey, signature, address } = await this.getAccountCrypto();

        const verified = cryptoUtils.xphereVerify(message, publicKey, signature);

        if (!verified) {
          throw new Error('Verification failed');
        }

        return { address };
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      SocketService.leaveRoom(roomId);
    }
  }
}

export default new LoginService();

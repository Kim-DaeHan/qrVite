import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';

const SASEUL = require('saseul');

class CryptoService {
  private ec: EC;

  constructor() {
    this.ec = new EC('secp256k1');
  }

  public xphereSign(msg: string, prKey: string) {
    const signature = SASEUL.Sign.signature(msg, prKey);
    return signature;
  }

  public xphereVerify(msg: string, pubKey: string, sig: string) {
    const verified = SASEUL.Sign.signatureValidity(msg, pubKey, sig);
    return verified;
  }

  public generateKeys() {
    const keyPair = this.ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic('hex');

    return {
      privateKey,
      publicKey,
    };
  }

  public sign(msg: string, prKey: string) {
    const key = this.ec.keyFromPrivate(prKey, 'hex');
    const signature = key.sign(msg);
    return signature;
  }

  public verify(msg: string, sig: EC.Signature, pubKey: string) {
    const key = this.ec.keyFromPublic(pubKey, 'hex');
    const verified = key.verify(msg, sig);
    return verified;
  }

  public encrypt(text: string, key: string) {
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return encrypted;
  }

  public decrypt(encryptedText: string, key: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}

export default new CryptoService();

import { ec as EC } from 'elliptic';

export type SignatureType = EC.Signature;

export interface QrType {
  qrCode: string;
  roomId: string;
  secretKey: string;
  sigMessage: string;
}

export interface CryptoInfoType {
  signature: EC.Signature;
  publicKey: string;
}

export interface AccountType {
  address: string;
}

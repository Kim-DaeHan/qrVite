import { ec as EC } from 'elliptic';

export type SignatureType = EC.Signature;

export interface QrType {
  qrCode: string;
  roomId: string;
}

export interface AccountCryptoType {
  signature: EC.Signature;
  publicKey: string;
  address: string;
  etc: string;
}

export interface AccountType {
  address: string;
}

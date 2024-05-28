import type { ec as EC } from 'elliptic';

export type SignatureType = EC.Signature;

export interface QrType {
  qrCode: string;
  roomId: string;
}

export interface AccountCryptoType {
  signature: string;
  publicKey: string;
  address: string;
  etc: string;
}

export interface AccountType {
  address: string;
}

import { MemoryAccount } from '@aeternity/aepp-sdk';

export const NODE_URL = 'http://localhost:3013';
export const COMPILER_URL = 'http://localhost:3080';
export const FAUCET_PUBLIC_ADDRESS =
  'ak_2dATVcZ9KJU5a8hdsVtTv21pYiGWiPbmVcU1Pz72FFqpk9pSRR'; //This refers to local node genesis account
export const FAUCET_SECRET_KEY =
  'bf66e1c256931870908a649572ed0257876bb84e3cdf71efb12f56c7335fad54d5cf08400e988222f26eb4b02c8f89077457467211a6e6d955edb70749c6a33b'; // This refers to local node genesis account
export const FAUCET_ACCOUNT = new MemoryAccount({
  keypair: {
    publicKey: FAUCET_PUBLIC_ADDRESS,
    secretKey: FAUCET_SECRET_KEY,
  },
});

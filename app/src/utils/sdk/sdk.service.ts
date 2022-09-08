import { AeSdk, MemoryAccount, Node } from '@aeternity/aepp-sdk';
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import {
  NODE_URL,
  COMPILER_URL,
  FAUCET_ACCOUNT,
  INITIATOR_KEYPAIR,
  RESPONDER_KEYPAIR,
} from './sdk.constants';

export let initiatorSdk: AeSdk;
export let responderSdk: AeSdk;

export async function getNewSdk(keypair: {
  publicKey: Encoded.AccountAddress;
  secretKey: string;
}) {
  const account = new MemoryAccount({ keypair });
  const node = new Node(NODE_URL);
  const newSdk = new AeSdk({
    nodes: [{ name: 'testnet', instance: node }],
    compilerUrl: COMPILER_URL,
  });
  await newSdk.addAccount(account, { select: true });
  return newSdk;
}

/**
 * a flag to indicate whether genesis account is currently funding or not.
 * If the flag is true, a delay of 0.3s is added to the funding process
 * in order to resolve account notch
 */
let isGenesisFunding = false;
export const genesisFund = async (
  sdk: AeSdk,
  address: Encoded.AccountAddress
): Promise<void> => {
  if (isGenesisFunding) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return genesisFund(sdk, address);
  }
  isGenesisFunding = true;
  await sdk.awaitHeight(2, {
    onAccount: FAUCET_ACCOUNT,
  });
  await sdk.spend(10e18, address, {
    onAccount: FAUCET_ACCOUNT,
  });
  isGenesisFunding = false;
};

/***
 * Initialize the two sdk instances and fund their accounts
 */
export async function initSdk() {
  // Initialize two sdk instances - with one account each
  initiatorSdk = await getNewSdk(INITIATOR_KEYPAIR);
  responderSdk = await getNewSdk(RESPONDER_KEYPAIR);

  // Fund accounts
  await genesisFund(initiatorSdk, INITIATOR_KEYPAIR.publicKey);
  await genesisFund(responderSdk, RESPONDER_KEYPAIR.publicKey);
}

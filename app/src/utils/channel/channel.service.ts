import { Channel, unpackTx } from '@aeternity/aepp-sdk';
import { ChannelOptions } from '@aeternity/aepp-sdk/es/channel/internal';
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import { buildContract, deployContract } from '../contract/contract.service';
import { setInitiatorContract, setResponderContract } from '../game-manager';
import { INITIATOR_KEYPAIR, RESPONDER_KEYPAIR } from '../sdk/sdk.constants';
import { Update } from './channel.types';
import {
  initiatorSdk,
  responderSdk,
  verifyContractBytecode,
} from '../sdk/sdk.service';

export async function initializeChannel(config: ChannelOptions) {
  const channelInstance = await Channel.initialize(config);
  return channelInstance;
}

export async function registerEvents(
  channelInstance: Channel,
  role: 'initiator' | 'responder'
) {
  channelInstance.on('statusChanged', async (status) => {
    if (status === 'open') {
      if (role === 'initiator') {
        // build and deploy the contract
        const contract = await deployContract(
          initiatorSdk,
          channelInstance,
          {
            player0: INITIATOR_KEYPAIR.publicKey,
            player1: RESPONDER_KEYPAIR.publicKey,
            reactionTime: 60000,
          },
          (tx) => initiatorSdk.signTransaction(tx)
        );
        setInitiatorContract(contract);
      }
    }
  });
}

export async function initiatorSignTx(
  _tag: string,
  tx: Encoded.Transaction,
  options?: {
    updates?: Update[];
  }
): Promise<Encoded.Transaction> {
  const update = options?.updates?.[0];

  return initiatorSdk.signTransaction(tx);
}

export async function responderSignTx(
  _tag: string,
  tx: Encoded.Transaction,
  options?: {
    updates?: Update[];
  }
): Promise<Encoded.Transaction> {
  const update = options?.updates?.[0];

  // if we are signing a transaction that deploys the contract
  // we want to verify that the bytecode is valid
  // and build the contract for the responder channel
  if (update?.op === 'OffChainNewContract' && update?.code && update?.owner) {
    const proposedBytecode = update.code;
    const isContractValid = verifyContractBytecode(proposedBytecode);
    if (!isContractValid) throw new Error('Contract is not valid');
    // @ts-expect-error ts-mismatch
    void buildContract(unpackTx(tx).tx.round, update.owner, responderSdk).then(
      (contract) => {
        setResponderContract(contract);
      }
    );
  }

  return responderSdk.signTransaction(tx);
}

import { Channel, unpackTx } from '@aeternity/aepp-sdk';
import { nextTick } from 'vue';
import {
  ChannelOptions,
  SignTxWithTag,
} from '@aeternity/aepp-sdk/es/channel/internal';
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import { buildContract, deployContract } from '../contract/contract.service';
import {
  revealRoundResult,
  setInitiatorContract,
  setResponderContract,
} from '../game-manager';
import { INITIATOR_KEYPAIR, RESPONDER_KEYPAIR } from '../sdk/sdk.constants';
import { Update } from './channel.types';
import {
  initiatorSdk,
  responderSdk,
  verifyContractBytecode,
} from '../sdk/sdk.service';
import { BigNumber } from 'bignumber.js';
import { GAME_STAKE, Methods } from '../contract/contract.constants';
import { ContractInstance } from '@aeternity/aepp-sdk/es/contract/aci';
import { useGameRoundStore } from '../../stores/game-round';

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
        console.log('Initiator contract ready');
      }
    }
  });
  channelInstance.on('stateChanged', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    if (
      role === 'initiator' &&
      useGameRoundStore().responderMove &&
      !useGameRoundStore().hasRevealed
    ) {
      nextTick(() => revealRoundResult());
    }
  });
}

export async function initiatorSignTx(
  _tag: string,
  tx: Encoded.Transaction
): Promise<Encoded.Transaction> {
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
        console.log('Responder contract ready');
        useGameRoundStore().index = 1;
      }
    );
  }

  return responderSdk.signTransaction(tx);
}

export async function callContract(
  channel: Channel,
  signTx: SignTxWithTag,
  contract: {
    instance: ContractInstance;
    address: Encoded.ContractAddress;
  },
  method: Methods,
  params: unknown[],
  amount?: number | BigNumber
) {
  const result = await channel.callContract(
    {
      amount: amount ?? GAME_STAKE,
      callData: contract.instance.calldata.encode(
        'RockPaperScissors',
        method,
        params
      ),
      contract: contract.address,
      abiVersion: 3,
    },
    // @ts-expect-error ts-mismatch
    async (
      tx,
      options: {
        updates: Update[];
      }
    ) => {
      return signTx(method, tx, options);
    }
  );
  return result;
}

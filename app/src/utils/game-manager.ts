import {
  callContract,
  initializeChannel,
  initiatorSignTx,
  registerEvents,
  responderSignTx,
} from './channel/channel.service';
import { MUTUAL_CHANNEL_CONFIGURATION } from './channel/channel.constants';
import { ChannelOptions } from '@aeternity/aepp-sdk/es/channel/internal';
import { Channel } from '@aeternity/aepp-sdk';
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import { ContractInstance } from '@aeternity/aepp-sdk/es/contract/aci';
import { Methods, Moves } from './contract/contract.constants';
import { getMoveHash } from './contract/contract.service';
import { useGameRoundStore } from '../stores/game-round';
import { INITIATOR_KEYPAIR } from './sdk/sdk.constants';

export let initiatorChannel: Channel;
export let responderChannel: Channel;

export let initiatorContract: {
  instance: ContractInstance;
  address: Encoded.ContractAddress;
};
export let responderContract: {
  instance: ContractInstance;
  address: Encoded.ContractAddress;
};

export function setInitiatorContract(contract: {
  instance: ContractInstance;
  address: Encoded.ContractAddress;
}) {
  initiatorContract = contract;
}

export function setResponderContract(contract: {
  instance: ContractInstance;
  address: Encoded.ContractAddress;
}) {
  responderContract = contract;
}

export async function initializeChannels() {
  const initiatorConfig: ChannelOptions = {
    ...MUTUAL_CHANNEL_CONFIGURATION,
    role: 'initiator',
    sign: initiatorSignTx,
  };
  const responderConfig: ChannelOptions = {
    ...MUTUAL_CHANNEL_CONFIGURATION,
    role: 'responder',
    sign: responderSignTx,
  };

  // Initialize the channel for the initiator
  initiatorChannel = await initializeChannel(initiatorConfig);
  // Initialize the channel for the responder
  responderChannel = await initializeChannel(responderConfig);

  // Register events for the channels
  await registerEvents(initiatorChannel, 'initiator');
  await registerEvents(responderChannel, 'responder');
}

export async function playerMakeMove(
  move: Moves,
  player: 'initiator' | 'responder'
) {
  const gameRoundStore = useGameRoundStore();
  const isInitiator = player === 'initiator';
  const result = await callContract(
    isInitiator ? initiatorChannel : responderChannel,
    isInitiator ? initiatorSignTx : responderSignTx,
    isInitiator ? initiatorContract : responderContract,
    isInitiator ? Methods.provide_hash : Methods.player1_move,
    [isInitiator ? getMoveHash(move, gameRoundStore.hashKey) : move]
  );
  if (result?.accepted) {
    if (isInitiator) {
      gameRoundStore.initiatorMove = move;
    } else {
      gameRoundStore.responderMove = move;
    }
  } else {
    console.error(result);
    throw new Error('Selection was not accepted');
  }
}

export async function revealRoundResult() {
  const gameRoundStore = useGameRoundStore();
  gameRoundStore.hasRevealed = true;
  await callContract(
    initiatorChannel,
    initiatorSignTx,
    initiatorContract,
    Methods.reveal,
    [gameRoundStore.hashKey, gameRoundStore.initiatorMove],
    0 // reveal method is not payable, so we use 0
  );
  return handleRoundResult();
}

async function handleRoundResult() {
  const result = await initiatorChannel.getContractCall({
    caller: INITIATOR_KEYPAIR.publicKey,
    contract: initiatorContract.address,
    round: initiatorChannel.round() as number,
  });
  const winner = initiatorContract.instance.calldata.decode(
    'RockPaperScissors',
    Methods.reveal,
    result.returnValue
  );
  return finishGameRound(winner);
}

async function finishGameRound(winner?: Encoded.AccountAddress) {
  const gameRoundStore = useGameRoundStore();
  gameRoundStore.winner = winner;
  gameRoundStore.isComplete = true;
}

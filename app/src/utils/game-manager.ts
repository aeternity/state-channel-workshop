import {
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

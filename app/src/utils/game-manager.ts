import { initializeChannel } from './channel/channel.service';
import { initiatorSdk, responderSdk } from './sdk/sdk.service';
import { MUTUAL_CHANNEL_CONFIGURATION } from './channel/channel.constants';
import { ChannelOptions } from '@aeternity/aepp-sdk/es/channel/internal';
import { Channel } from '@aeternity/aepp-sdk';

export let initiatorChannel: Channel;
export let responderChannel: Channel;

export async function initializeChannels() {
  const initiatorConfig: ChannelOptions = {
    ...MUTUAL_CHANNEL_CONFIGURATION,
    role: 'initiator',
    sign: (_tag, tx) => initiatorSdk.signTransaction(tx),
  };
  const responderConfig: ChannelOptions = {
    ...MUTUAL_CHANNEL_CONFIGURATION,
    role: 'responder',
    sign: (_tag, tx) => responderSdk.signTransaction(tx),
  };

  // Initialize the channel for the initiator
  initiatorChannel = await initializeChannel(initiatorConfig);
  // Initialize the channel for the responder
  responderChannel = await initializeChannel(responderConfig);
}

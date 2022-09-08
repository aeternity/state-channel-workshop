import { Channel } from '@aeternity/aepp-sdk';
import { ChannelOptions } from '@aeternity/aepp-sdk/es/channel/internal';

export async function initializeChannel(config: ChannelOptions) {
  const channelInstance = await Channel.initialize(config);
  return channelInstance;
}

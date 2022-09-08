import { ChannelOptions } from '@aeternity/aepp-sdk/es/channel/internal';
import BigNumber from 'bignumber.js';
import { INITIATOR_KEYPAIR, RESPONDER_KEYPAIR } from '../sdk/sdk.constants';

export const WEBSOCKET_URL = 'ws://localhost:3014/channel';
export const MUTUAL_CHANNEL_CONFIGURATION: Omit<
  ChannelOptions,
  'role' | 'sign'
> & {
  minimumDepthStrategy: 'plain' | 'txFee';
  minimumDepth: number;
} = {
  url: WEBSOCKET_URL,
  pushAmount: 0,
  initiatorAmount: new BigNumber('5e18'),
  responderAmount: new BigNumber('5e18'),
  initiatorId: INITIATOR_KEYPAIR.publicKey,
  responderId: RESPONDER_KEYPAIR.publicKey,
  host: 'localhost',
  port: 3333,
  channelReserve: 2,
  // We're using 0 for lockPeriod in order to quickly close the channel
  // in cases where the initiator needs to solo close it and finally.
  // execute channel_settle transaction
  // read more: https://github.com/aeternity/protocol/blob/master/channels/ON-CHAIN.md#channel_settle
  lockPeriod: 0,
  // workaround: minimize the number of node hangs
  timeoutIdle: 2 * 60 * 60 * 1000,
  debug: true,
  // How to calculate minimum depth - either txfee (default) or plain. We use
  // `plain` with `minimumDepth` in order to reduce delay.
  minimumDepthStrategy: 'plain',
  minimumDepth: 0,
} as const;

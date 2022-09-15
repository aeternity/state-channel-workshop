`channel.constants.ts`
``` typescript
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
```
----
`channel.types.ts`
``` typescript
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';

export interface Update {
  call_data: Encoded.ContractBytearray;
  contract_id: Encoded.ContractAddress;
  op: 'OffChainCallContract' | 'OffChainNewContract';
  code?: Encoded.ContractBytearray;
  owner?: Encoded.AccountAddress;
  caller_id?: Encoded.AccountAddress;
}
```
---
`contract.constants.ts`
``` typescript
import BigNumber from 'bignumber.js';

export const CONTRACT_CONFIGURATION = {
  deposit: 0e18,
  vmVersion: 5,
  abiVersion: 3,
} as const;

export const CONTRACT_NAME = 'RockPaperScissors';
export const GAME_STAKE = new BigNumber('0.01e18');
export enum Moves {
  rock = 'rock',
  paper = 'paper',
  scissors = 'scissors',
}

export enum Methods {
  init = 'init',
  provide_hash = 'provide_hash',
  get_state = 'get_state',
  player1_move = 'player1_move',
  reveal = 'reveal',
  player1_dispute_no_reveal = 'player1_dispute_no_reveal',
  player0_dispute_no_move = 'player0_dispute_no_move',
  set_timestamp = 'set_timestamp',
}
```
---
`contract.ts`
``` typescript
export { default as contractAci } from './contract-aci.json';

export const contractBytecode: Encoded.ContractBytearray =
  'cb_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aW1lc3RhbXARPR6JaCVnZXRfc3RhdGURRNZEHxFpbml0EVFXpvkxY29tcHV0ZV9oYXNoEVjLtZKJLlJvY2tQYXBlclNjaXNzb3JzLnJlcXVpcmVfcGxheWVyMBFlpeAPLUNoYWluLmV2ZW50EWrApr7BLlJvY2tQYXBlclNjaXNzb3JzLmVuc3VyZV9wbGF5ZXIwX3R1cm5fdG9fcmV2ZWFsEXtiH9NdcGxheWVyMF9kaXNwdXRlX25vX21vdmURk0NDObkuUm9ja1BhcGVyU2Npc3NvcnMuZW5zdXJlX3BsYXllcjFfdHVybl90b19tb3ZlEagFMsAZcmV2ZWFsEauIMtE5LlN0cmluZy5jb25jYXQRtLEvhmVwbGF5ZXIxX2Rpc3B1dGVfbm9fcmV2ZWFsEcLTCMx5LlJvY2tQYXBlclNjaXNzb3JzLnN0cl90b19tb3ZlEcYWcVyJLlJvY2tQYXBlclNjaXNzb3JzLnJlcXVpcmVfcGxheWVyMRHJV7fPpS5Sb2NrUGFwZXJTY2lzc29ycy5lbnN1cmVfaWZfa2V5X2lzX3ZhbGlkEc5HFWA5LlN0cmluZy5zaGEyNTYRz7/qGnkuUm9ja1BhcGVyU2Npc3NvcnMucmVzZXRfc3RhdGUR6QHY/xkuXjEzMTQR78tQ7z0uT3B0aW9uLmRlZmF1bHSCLwCFNi4xLjABsLPzxw==';

```
---
`contract-aci.json`
``` json
{
  "encodedAci": {
    "contract": {
      "event": {
        "variant": [
          {
            "Init": ["address", "address", "int"]
          },
          {
            "Player0Won": ["address", "int"]
          },
          {
            "Player1Won": ["address", "int"]
          },
          {
            "Draw": ["int", "int", "string"]
          },
          {
            "Player0ProvidedHash": ["hash", "int"]
          },
          {
            "Player0Revealed": ["string"]
          },
          {
            "Player1Moved": ["string", "int"]
          },
          {
            "Player0WonDispute": ["address", "int"]
          },
          {
            "Player1WonDispute": ["address", "int"]
          }
        ]
      },
      "functions": [
        {
          "arguments": [],
          "name": "get_state",
          "payable": false,
          "returns": "RockPaperScissors.state",
          "stateful": false
        },
        {
          "arguments": [
            {
              "name": "player0",
              "type": "address"
            },
            {
              "name": "player1",
              "type": "address"
            },
            {
              "name": "reaction_time",
              "type": "int"
            },
            {
              "name": "debug_timestamp",
              "type": {
                "option": ["int"]
              }
            }
          ],
          "name": "init",
          "payable": false,
          "returns": "RockPaperScissors.state",
          "stateful": false
        },
        {
          "arguments": [
            {
              "name": "hash",
              "type": "hash"
            }
          ],
          "name": "provide_hash",
          "payable": true,
          "returns": "unit",
          "stateful": true
        },
        {
          "arguments": [
            {
              "name": "move_str",
              "type": "string"
            }
          ],
          "name": "player1_move",
          "payable": true,
          "returns": "unit",
          "stateful": true
        },
        {
          "arguments": [
            {
              "name": "key",
              "type": "string"
            },
            {
              "name": "move_str",
              "type": "string"
            }
          ],
          "name": "reveal",
          "payable": false,
          "returns": {
            "option": ["address"]
          },
          "stateful": true
        },
        {
          "arguments": [],
          "name": "player1_dispute_no_reveal",
          "payable": false,
          "returns": "unit",
          "stateful": true
        },
        {
          "arguments": [],
          "name": "player0_dispute_no_move",
          "payable": false,
          "returns": "unit",
          "stateful": true
        },
        {
          "arguments": [
            {
              "name": "key",
              "type": "string"
            },
            {
              "name": "move",
              "type": "string"
            }
          ],
          "name": "compute_hash",
          "payable": false,
          "returns": "hash",
          "stateful": false
        },
        {
          "arguments": [
            {
              "name": "timestamp",
              "type": "int"
            }
          ],
          "name": "set_timestamp",
          "payable": false,
          "returns": "unit",
          "stateful": true
        }
      ],
      "kind": "contract_main",
      "name": "RockPaperScissors",
      "payable": true,
      "state": {
        "record": [
          {
            "name": "player0",
            "type": "address"
          },
          {
            "name": "player1",
            "type": "address"
          },
          {
            "name": "hash",
            "type": {
              "option": ["hash"]
            }
          },
          {
            "name": "last_move_timestamp",
            "type": "int"
          },
          {
            "name": "player1_move",
            "type": {
              "option": ["RockPaperScissors.move"]
            }
          },
          {
            "name": "stake",
            "type": "int"
          },
          {
            "name": "reaction_time",
            "type": "int"
          },
          {
            "name": "debug_timestamp",
            "type": {
              "option": ["int"]
            }
          }
        ]
      },
      "type_defs": [
        {
          "name": "move",
          "typedef": {
            "variant": [
              {
                "Paper": []
              },
              {
                "Rock": []
              },
              {
                "Scissors": []
              }
            ]
          },
          "vars": []
        }
      ]
    }
  },
  "externalEncodedAci": [
    {
      "namespace": {
        "name": "ListInternal",
        "type_defs": []
      }
    },
    {
      "namespace": {
        "name": "List",
        "type_defs": []
      }
    },
    {
      "namespace": {
        "name": "String",
        "type_defs": []
      }
    },
    {
      "namespace": {
        "name": "Option",
        "type_defs": []
      }
    }
  ],
  "interface": "\n\n\n\npayable main contract RockPaperScissors =\n  record state = {player0 : address,player1 : address,hash : option(hash),last_move_timestamp : int,player1_move : option(RockPaperScissors.move),stake : int,reaction_time : int,debug_timestamp : option(int)}\n  datatype event = Init(address, address, int) | Player0Won(address, int) | Player1Won(address, int) | Draw(int, int, string) | Player0ProvidedHash(hash, int) | Player0Revealed(string) | Player1Moved(string, int) | Player0WonDispute(address, int) | Player1WonDispute(address, int)\n  datatype move = Paper | Rock | Scissors\n  entrypoint get_state : () => RockPaperScissors.state\n  entrypoint init : (address, address, int, option(int)) => RockPaperScissors.state\n  payable stateful entrypoint provide_hash : (hash) => unit\n  payable stateful entrypoint player1_move : (string) => unit\n  stateful entrypoint reveal : (string, string) => option(address)\n  stateful entrypoint player1_dispute_no_reveal : () => unit\n  stateful entrypoint player0_dispute_no_move : () => unit\n  entrypoint compute_hash : (string, string) => hash\n  stateful entrypoint set_timestamp : (int) => unit\n"
}

```
---
`game-round.ts`
``` typescript
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import BigNumber from 'bignumber.js';
import { defineStore } from 'pinia';
import { Moves } from '../utils/contract/contract.constants';

interface GameRoundStore {
  initiatorMove?: Moves;
  responderMove?: Moves;
  hasRevealed: boolean;
  index: number;
  isComplete: boolean;
  winner?: Encoded.AccountAddress;
  hashKey: string;
  initiatorBalance?: BigNumber;
  responderBalance?: BigNumber;
}

export const useGameRoundStore = defineStore<
  'gameRound',
  GameRoundStore,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  { startNewRound: () => void; }
>('gameRound', {
  state: () => ({
    initiatorMove: undefined,
    responderMove: undefined,
    hasRevealed: false,
    index: 0,
    isComplete: false,
    winner: undefined,
    hashKey: Math.random().toString(16).substring(2, 8),
    initiatorBalance: undefined,
    responderBalance: undefined,
  }),
  actions: {
    startNewRound() {
      this.index++;
      this.initiatorMove = undefined;
      this.responderMove = undefined;
      this.isComplete = false;
      this.hasRevealed = false;
      this.winner = undefined;
      this.hashKey = Math.random().toString(16).substring(2, 8);
    },
  },
});
```
---
`channel-status.vue`
``` typescript
<script setup lang="ts">
defineProps<{
  status: string;
}>();
</script>

<template>
  <div class="channel-status">Channel status: {{ status }}</div>
</template>

<style scoped lang="scss">
.channel-status {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.87);
  color: #242424;
  border-radius: 5px;
  padding: 5px 10px;
  width: max-content;
}
</style>
```
----
`game-screen.vue`
```typescript
<style scoped lang="scss">
.game-screen {
  display: grid;
  grid-template-rows: auto 200px auto;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .players {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}
</style>
```
---
`player-controls.vue`
``` typescript
<style scoped lang="scss">
.player-controls {
  .moves {
    margin-top: 10px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 10px;
  }
}
</style>
```

`empty-component.vue`
``` typescript
<script setup lang="ts">

</script>

<template>
  <div class="">
  </div>
</template>

<style scoped lang="scss"></style>
```
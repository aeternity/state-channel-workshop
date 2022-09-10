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
  { startNewRound: () => void; reset: () => void }
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
    reset() {
      this.index = 0;
      this.initiatorMove = undefined;
      this.responderMove = undefined;
      this.isComplete = false;
      this.hasRevealed = false;
      this.winner = undefined;
      this.initiatorBalance = undefined;
      this.responderBalance = undefined;
      this.hashKey = Math.random().toString(16).substring(2, 8);
    },
  },
});

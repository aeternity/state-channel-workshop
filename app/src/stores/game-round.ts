import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
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
}

export const useGameRoundStore = defineStore<
  'gameRound',
  GameRoundStore,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  { startNewRound: () => void }
>('gameRound', {
  state: () => ({
    initiatorMove: undefined,
    responderMove: undefined,
    hasRevealed: false,
    index: 0,
    isComplete: false,
    winner: undefined,
    hashKey: Math.random().toString(16).substring(2, 8),
  }),
  actions: {
    startNewRound() {
      const gameRoundStore = useGameRoundStore();
      gameRoundStore.index++;
      gameRoundStore.initiatorMove = undefined;
      gameRoundStore.responderMove = undefined;
      gameRoundStore.isComplete = false;
      gameRoundStore.hasRevealed = false;
      gameRoundStore.winner = undefined;
      gameRoundStore.hashKey = Math.random().toString(16).substring(2, 8);
    },
  },
});

<script setup lang="ts">
import PlayerControls from './player-controls.vue';
import { useGameRoundStore } from '../stores/game-round';
import { computed } from 'vue';
import {
  INITIATOR_KEYPAIR,
  RESPONDER_KEYPAIR,
} from '../utils/sdk/sdk.constants';

const gameRoundStore = useGameRoundStore();
const winner = computed(() => {
  if (gameRoundStore.isComplete) {
    if (gameRoundStore.winner === INITIATOR_KEYPAIR.publicKey)
      return 'The initiator wins!';
    else if (gameRoundStore.winner === RESPONDER_KEYPAIR.publicKey)
      return 'The responder wins!';
    else return "It's a draw!";
  } else return null;
});
</script>

<template>
  <div class="game-screen">
    <div>{{ winner }}</div>
    <div class="players">
      <PlayerControls
        player="initiator"
        :isDisabled="
          gameRoundStore.index <= 0 || !!gameRoundStore.initiatorMove
        "
      />
      <PlayerControls
        player="responder"
        :isDisabled="
          !gameRoundStore.initiatorMove || !!gameRoundStore.responderMove
        "
      />
    </div>
    <button
      v-if="gameRoundStore.isComplete"
      @click="gameRoundStore.startNewRound()"
    >
      New Round
    </button>
  </div>
</template>

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
}
</style>

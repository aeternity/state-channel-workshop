<script setup lang="ts">
import { Moves } from '../utils/contract/contract.constants';
import { playerMakeMove } from '../utils/game-manager';

const props = defineProps<{
  player: 'initiator' | 'responder';
  isDisabled: boolean;
}>();

const title = `${props.player} controls`;

function makeMove(move: Moves) {
  playerMakeMove(move, props.player);
}
</script>

<template>
  <div class="player-controls">
    <div>{{ title }}</div>
    <div class="moves">
      <button :disabled="isDisabled" @click="makeMove(Moves.rock)">rock</button>
      <button :disabled="isDisabled" @click="makeMove(Moves.paper)">
        paper
      </button>
      <button :disabled="isDisabled" @click="makeMove(Moves.scissors)">
        scissors
      </button>
    </div>
  </div>
</template>

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

<script setup lang="ts">
import { ref } from 'vue';
import { initSdk, initiatorSdk, responderSdk } from '../utils/sdk/sdk.service';
import {
  initializeChannels,
  initiatorChannel,
  responderChannel,
} from '../utils/game-manager';

const isChannelOpening = ref(false);

async function initializeSdk() {
  isChannelOpening.value = true;
  await initSdk();
  console.log(initiatorSdk);
  console.log(responderSdk);
  await initializeChannels();
  console.log(initiatorChannel);
  console.log(responderChannel);
}
</script>

<template>
  <div class="channel-initialization">
    <h1>Channel Initialization</h1>
    <p>This is the channel initialization component.</p>
    <button @click="initializeSdk()" :disabled="isChannelOpening">
      Initialize Channel
    </button>
  </div>
</template>

<style scoped lang="scss"></style>

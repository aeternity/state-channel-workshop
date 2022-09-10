<script setup lang="ts">
import { ref } from 'vue';
import { initSdk } from '../utils/sdk/sdk.service';
import { initializeChannels } from '../utils/game-manager';

const emit = defineEmits(['channelsInitialized']);
const isChannelOpening = ref(false);

async function initializeSdk() {
  isChannelOpening.value = true;
  await initSdk();
  await initializeChannels();
  emit('channelsInitialized');
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

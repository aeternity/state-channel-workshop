<script setup lang="ts">
import { initSdk, initiatorSdk, responderSdk } from '../utils/sdk/sdk.service';

async function initializeSdk() {
  await initSdk();
  console.log(initiatorSdk);
  console.log(responderSdk);
}
</script>

<template>
  <div class="channel-initialization">
    <h1>Channel Initialization</h1>
    <p>This is the channel initialization component.</p>
    <button @click="initializeSdk()">Initialize Channel</button>
  </div>
</template>

<style scoped lang="scss"></style>

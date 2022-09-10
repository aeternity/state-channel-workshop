<script setup lang="ts">
import { ref, computed } from 'vue';
import ChannelInitialization from './components/channel-initialization.vue';
import ChannelStatus from './components/channel-status.vue';
import GameScreen from './components/game-screen.vue';
import { initiatorChannel } from './utils/game-manager';

const channelStatus = ref('N/A');

const channelIsOpen = computed(() => {
  return channelStatus.value === 'open';
});

function handleChannelInitialization() {
  initiatorChannel.on('statusChanged', async (status) => {
    channelStatus.value = status;
  });
}
</script>

<template>
  <ChannelStatus :status="channelStatus" />
  <ChannelInitialization
    @channelsInitialized="handleChannelInitialization()"
    v-if="!channelIsOpen"
  />
  <GameScreen v-if="channelIsOpen" />
</template>

<style scoped lang="scss"></style>

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

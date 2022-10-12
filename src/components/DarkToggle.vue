<script setup lang="ts">
const toggle = toggleDark
</script>

<template>
  <button
    icon-btn
    i-carbon-sun dark:i-carbon-moon
    @click="toggle()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div flex="~ gap2" text-xl items-center px8 pt8 pb2>
    <h1 text-3xl font-bold text-primary>
      {{ t('navbar.title') }}
    </h1>
    <div flex-auto />
    <LangToggle />
    <a icon-btn i-carbon-logo-github href="https://github.com/cosmoscatts/vue-todo-list" target="_blank" title="GitHub" />
    <DarkToggle />
  </div>
</template>

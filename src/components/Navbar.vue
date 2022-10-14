<script setup lang="ts">
const { t } = useI18n()

const toggle = toggleLeftListTag
</script>

<template>
  <div flex="~ gap2" text-xl items-center px8 pt8 pb2>
    <h1 text="4xl primary" font-bold>
      {{ t('navbar.title') }}
    </h1>
    <div flex-auto />
    <div icon-btn cursor-pointer i-carbon-menu md:hidden @click="toggle" />
    <LangToggle />
    <a icon-btn i-carbon-logo-github href="https://github.com/cosmoscatts/vue-todo-list" target="_blank" title="GitHub" />
    <DarkToggle />
  </div>
</template>

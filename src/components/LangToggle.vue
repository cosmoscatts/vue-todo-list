<script setup lang="ts">
const { availableLocales, locale } = useI18n()
const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <button
    icon-btn
    i-carbon-translate
    @click="toggleLocales"
  />
</template>

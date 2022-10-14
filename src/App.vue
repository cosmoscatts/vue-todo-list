<script setup lang="ts">
import ListTab from './components/ListTab.vue'

const showLeftListTag = leftListTagVisibility

const refLeft = ref()
onClickOutside(refLeft, hideLeftListTag)
</script>

<template>
  <div
    w-70vw h-full
    lt-sm="w-full"
    mx-a pb-5vh
  >
    <Navbar />
    <div
      flex="~ gap-1vw"
      min-h-80vh
    >
      <ListTab lt-md:hidden />
      <ListTodo />
    </div>
    <div v-show="showLeftListTag" h-screen w-screen fixed top-0 left-0 z-10 bg="black/30">
      <div ref="refLeft" h-full md:hidden absolute top-0 left-0 bg="white dark:gray-900">
        <ListTab w-300px />
      </div>
    </div>
  </div>
</template>


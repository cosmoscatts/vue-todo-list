<script setup lang="ts">

</script>

<template>
  <div
    w-70vw h-full
    lt-sm="w-full"
    of-hidden mx-a
  >
    <Navbar />
    <div
      flex="~ gap-1vw"
      h-80vh of-hidden
    >
      <ListTab />
      <ListTodo />
    </div>
  </div>
</template>


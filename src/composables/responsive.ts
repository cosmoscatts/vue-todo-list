export const leftListTagVisibility = ref(false)
export const toggleLeftListTag = () => leftListTagVisibility.value = !leftListTagVisibility.value
export const hideLeftListTag = () => leftListTagVisibility.value = false

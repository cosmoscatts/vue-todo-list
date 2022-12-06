<script setup lang="ts">
import type { TabItem } from '~/types'

const { t } = useI18n()
const tabData = ref(getTabList())
watch(tabData, setTabList, { deep: true })

const editedTab = ref<TabItem | null>(null)
const beforeEditCache = ref<string | undefined>()

function changeSelectedTab(val: number) {
  selectedTab.value = val
}

function addTab(e: KeyboardEvent) {
  const target = e.target as HTMLTextAreaElement
  const title = target.value.trim()
  if (!title) return

  const id = Date.now()
  tabData.value.push({
    id,
    title,
  })
  selectedTab.value = id
  target.value = ''
}

function editTab(tab: TabItem) {
  beforeEditCache.value = tab.title
  editedTab.value = tab
}

function doneEdit(tab: TabItem) {
  if (!editedTab.value) return

  editedTab.value = null
  tab.title = tab.title?.trim()
  if (!tab.title) removeTab(tab)
}

function cancelEdit(tab: TabItem) {
  editedTab.value = null
  tab.title = beforeEditCache.value
}

function removeTab(tab: TabItem) {
  const { value: data } = tabData
  data.splice(data.indexOf(tab), 1)
  if (tab.id === selectedTab.value) {
    selectedTab.value = tabData.value[0].id
  }
  removeTabEffect(tab)
}

const isTabSelected = (id: number) => id === selectedTab.value
</script>

<template>
  <div w-21vw flex="~ col" p-2>
    <div bg-content lt-md="!bg-transparent" h-full>
      <h3 text="24px primary center" font-bold py-15px border-b="2px dashed primary">
        {{ t('listTab.title') }}
      </h3>
      <ul class="tab-list" border-b="2px dashed primary">
        <li
          v-for="tab in tabData" :key="tab.id" class="tab"
          :class="{ editing: tab === editedTab }"
        >
          <div class="view" flex justify-center items-center>
            <div i-carbon-tag text-xl :class="{ 'text-primary': isTabSelected(tab.id) }" cursor-pointer />
            <label cursor-pointer :class="{ 'text-primary': isTabSelected(tab.id) }" @click="changeSelectedTab(tab.id)" @dblclick="editTab(tab)">{{ tab.title }}</label>
            <button class="destroy" @click="removeTab(tab)" />
          </div>
          <input
            v-if="tab === editedTab" v-model="tab.title" class="edit" bg-content type="text"
            @vnode-mounted="({ el }: any) => el.focus()" @blur="doneEdit(tab)" @keyup.enter="doneEdit(tab)"
            @keyup.escape="cancelEdit(tab)"
          >
        </li>
      </ul>
      <div mt-15px>
        <input
          class="new-tab"
          bg-content
          :placeholder="t('listTab.addBtn')"
          @keyup.enter="addTab"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-tab,
.edit {
  position: relative;
  z-index: 2;
  margin: 0;
  width: 100%;
  font-size: 18px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.2em;
  color: inherit;
  text-align: center;
  padding: 6px;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.new-tab {
  padding: 16px;
  height: 40px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.tab-list {
  margin: 0;
  padding: 10px 0;
  list-style: none;
}

.tab-list li {
  position: relative;
  font-size: 18px;
}

.tab-list li.editing {
  padding: 0;
}

.tab-list li.editing .edit {
  display: block;
  padding: 16px;
  opacity: 0.75;
}

.tab-list li.editing .view {
  display: none;
}

.tab-list li label {
  word-break: break-all;
  padding: 15px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
  font-weight: 400;
  opacity: 0.75;
}

.tab-list li.completed label {
  color: #949494;
  text-decoration: line-through;
}

.tab-list li .destroy {
  display: none;
  position: absolute;
  top: calc(50% - 5px);
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 20px;
  font-weight: 800;
  color: #949494;
  transition: color 0.2s ease-out;
}

.tab-list li .destroy:hover,
.tab-list li .destroy:focus {
  color: #C18585;
}

.tab-list li .destroy:after {
  content: '×';
  display: block;
  height: 100%;
  line-height: 1.1;
}

.tab-list li:hover .destroy {
  display: block;
}

.tab-list li .edit {
  display: none;
}

.tab-list li.editing:last-child {
  margin-bottom: -1px;
}

:focus {
  box-shadow: 0 0 2px 2px #377BB5;
  outline: 0;
  z-index: 3;
}
</style>

import type { TabItem, TodoItem } from '~/types'

export const TODO_STORAGE_KEY = 'vue-todo-list'
export const TAB_STORAGE_KEY = 'vue-tab-list'

function generateDefault(): { defaultTabs: TabItem[]; defaultTodos: Record<string, TodoItem[]> } {
  return {
    defaultTabs: [
      { id: 1001, title: '学习计划' },
      { id: 1002, title: '出行计划' },
    ],
    defaultTodos: {
      1001: [
        { id: Date.now(), title: 'C语言', completed: false },
        { id: Date.now(), title: 'JAVA-从入门到放弃', completed: false },
      ],
      1002: [
        { id: Date.now(), title: '一起爬山', completed: false },
        { id: Date.now(), title: '一起旅行', completed: false },
      ],
    },
  }
}

const { defaultTabs, defaultTodos } = generateDefault()

// 选中的 `tab`
export const selectedTab = ref<number | null>(null)

/**
 * 初始化 `tabStorage`
 */
function initStore() {
  const tabStr = localStorage.getItem(TAB_STORAGE_KEY)
  if (!tabStr) {
    localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(defaultTabs))
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(defaultTodos))
  }
  selectedTab.value = getTabList()[0].id
}
initStore()

/**
 * 从 `storage` 获取 `tab`
 */
export function getTabList(): TabItem[] {
  const tabStr = localStorage.getItem(TAB_STORAGE_KEY)
  if (!tabStr) {
    selectedTab.value = null
    return []
  }
  return JSON.parse(tabStr)
}

/**
 * 从 `storage` 获取 `todo`
 */
export function getTodoList(): TodoItem[] {
  const todoStr = localStorage.getItem(TODO_STORAGE_KEY)

  if (!todoStr || !selectedTab.value)
    return []

  return JSON.parse(todoStr)[selectedTab.value] || []
}

export function setTodoList(data: TodoItem[]) {
  if (!selectedTab.value)
    return

  const todoStr = localStorage.getItem(TODO_STORAGE_KEY)

  const newData: Record<number, TodoItem[]> = {}
  newData[selectedTab.value] = [...data]

  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify({
    ...JSON.parse(todoStr ?? '{}'),
    ...newData,
  }))
}

export function setTabList(data: TabItem[]) {
  localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify([
    ...data,
  ]))
}

/**
 * 删除缓存中`tab` 相关的 `todo`
 */
export function removeTabEffect(tab: TabItem) {
  const todoStr = localStorage.getItem(TODO_STORAGE_KEY)
  if (!todoStr)
    return

  const newData: Record<number, TabItem[]> = {}
  const data = JSON.parse(todoStr) || []
  for (const key of Object.keys(data)) {
    if (Number(key) !== tab.id)
      newData[Number(key)] = data[key]
  }
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify({
    ...newData,
  }))
}

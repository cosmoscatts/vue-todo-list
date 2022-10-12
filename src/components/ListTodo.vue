<script setup lang="ts">
import type { TodoItem, Visibility } from '~/types'

const STORAGE_KEY = 'vue-todo-list'

const { t } = useI18n()

const todoData = ref<TodoItem[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
todoData.value = [
  { id: Date.now(), title: '爬山', completed: false },
  { id: Date.now(), title: '旅游', completed: true },
]
watch(todoData, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const editedTodo = ref<TodoItem | null>(null)
const visibility = ref<Visibility>('all')
const beforeEditCache = ref<string | undefined>()

const filters = {
  all: (list: TodoItem[]) => list,
  active: (list: TodoItem[]) => list.filter(item => !item.completed),
  completed: (list: TodoItem[]) => list.filter(item => item.completed),
}

const filteredTodoData = computed(() => filters[visibility.value](todoData.value))

const remaining = computed(() => filters.active(todoData.value).length)

function addTodo(e: KeyboardEvent) {
  const target = e.target as HTMLTextAreaElement
  const value = target.value.trim()
  if (!value)
    return

  todoData.value.push({
    id: Date.now(),
    title: value,
    completed: false,
  })

  target.value = ''
}

function editTodo(todo: TodoItem) {
  beforeEditCache.value = todo.title
  editedTodo.value = todo
}

function doneEdit(todo: TodoItem) {
  if (!editedTodo.value)
    return

  editedTodo.value = null
  todo.title = todo.title?.trim()
  if (!todo.title)
    removeTodo(todo)
}

function cancelEdit(todo: TodoItem) {
  editedTodo.value = null
  todo.title = beforeEditCache.value
}

function removeTodo(todo: TodoItem) {
  const { value: data } = todoData
  data.splice(data.indexOf(todo), 1)
}

function removeCompleted() {
  todoData.value = filters.active(todoData.value)
}

function onHashChange() {
  const _visibility = window.location.hash.replace(/#\/?/, '')
  if (Object.keys(filters).includes(_visibility)) {
    visibility.value = _visibility as Visibility
  }
  else {
    window.location.hash = ''
    visibility.value = 'all' as const
  }
}

onMounted(() => {
  onHashChange()
  window.addEventListener('hashchange', onHashChange)
})
</script>

<template>
  <div w-48vw lt-md:w-full flex="~ col" p-2 of-y-auto>
    <input
      h-65px z-2 p-16px pl-60px border-none text-24px font-italic bg-content focus:outline="~ 3 [#377BB5]"
      shadow="md dark:gray-700" autofocus :placeholder="t('listTodo.input.newTodo')" @keyup.enter="addTodo"
    >
    <TransitionGroup name="fade" relative>
      <ul m0 p0 list-none bg-content class="todo-list">
        <li
          v-for="todo in filteredTodoData" :key="todo.id" relative text-24px
          border-b="1px solid [#ededed] dark:gray-600"
        >
          <div class="view">
            <input
              v-model="todo.completed" type="checkbox" class="toggle" absolute top-0 bottom-0 w-40px m="a 0"
              text-center border-none appearance-none
            >
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button @click="removeTodo(todo)" />
          </div>
          <input
            v-if="todo === editedTodo" v-model="todo.title" type="text"
            @vnode-mounted="({ el }: any) => el.focus()" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          >
        </li>
      </ul>
    </TransitionGroup>
    <div v-show="todoData.length" bg-content h-50px flex justify-between items-center class="footer">
      <span>
        <strong>{{ remaining }}</strong>
        <span>
          {{
            remaining === 1
              ? t('listTodo.footer.item')
              : t('listTodo.footer.items') }} {{ t('listTodo.footer.left')
          }}
        </span>
      </span>
      <ul flex gap-x-5>
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">{{ t('listTodo.footer.all') }}</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">{{ t('listTodo.footer.active') }}</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">{{ t('listTodo.footer.completed')
          }}</a>
        </li>
      </ul>
      <button v-show="todoData.length > remaining" @click="removeCompleted">
        {{ t('listTodo.footer.clearCompleted') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-list li .toggle {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

.todo-list li .toggle {
  opacity: 0;
}

.todo-list li .toggle+label {
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: center left;
}

.todo-list li .toggle:checked+label {
  background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
}

.todo-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 60px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
  font-weight: 400;
  color: #484848;
}

.todo-list li.completed label {
  color: #949494;
  text-decoration: line-through;
}

.footer:before {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgb(0 0 0 / 20%), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgb(0 0 0 / 20%), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgb(0 0 0 / 20%);
}
</style>

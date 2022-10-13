<script setup lang="ts">
import type { TodoItem, Visibility } from '~/types'

const { t } = useI18n()

const todoData = ref<TodoItem[]>(getTodoList())
watch(selectedTab, () => {
  todoData.value = getTodoList()
})

watch([todoData, selectedTab], ([x1, y1], [_x2, y2]) => {
  if (y1 === y2)
    setTodoList(x1)
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

function toggleAll(e: any) {
  todoData.value.forEach(todo => (todo.completed = e.target.checked))
}

const borderColor = computed(() => isDark.value ? '#4b5563' : '#ededed')
const footerBoxShadowColor = computed(() => isDark.value ? '#333B48' : '#F6F6F6')

onMounted(() => {
  onHashChange()
  window.addEventListener('hashchange', onHashChange)
})
</script>

<template>
  <div w-48vw lt-md:w-full flex="~ col" p-2>
    <input class="new-todo" bg-content autofocus :placeholder="t('listTodo.input.newTodo')" @keyup.enter="addTodo">
    <section v-show="todoData.length" class="main" bg-content>
      <input id="toggle-all" class="toggle-all" type="checkbox" :checked="remaining === 0" @change="toggleAll">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodoData" :key="todo.id" class="todo"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input v-model="todo.completed" class="toggle" type="checkbox">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)" />
          </div>
          <input
            v-if="todo === editedTodo" v-model="todo.title" class="edit" bg-content type="text"
            @vnode-mounted="({ el }: any) => el.focus()" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          >
        </li>
      </ul>
    </section>
    <footer v-show="todoData.length" class="footer" bg-content>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining === 1 ? t('listTodo.footer.item') : t('listTodo.footer.items') }} {{ t('listTodo.footer.left') }}</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">{{ t('listTodo.footer.all') }}</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">{{ t('listTodo.footer.active') }}</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">{{ t('listTodo.footer.completed') }}</a>
        </li>
      </ul>
      <button v-show="todoData.length > remaining" class="clear-completed" @click="removeCompleted">
        {{ t('listTodo.footer.clearCompleted') }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.new-todo,
.edit {
  position: relative;
  z-index: 2;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 6px;
  border: 1px solid v-bind(borderColor);
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  height: 65px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.main {
  position: relative;
  border-top: 1px solid v-bind(borderColor);
}

.toggle-all {
  width: 1px;
  height: 1px;
  border: none;
  opacity: 0;
  position: absolute;
  right: 100%;
  bottom: 100%;
}

.toggle-all+label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 65px;
  font-size: 0;
  position: absolute;
  top: -65px;
  left: -0;
}

.toggle-all+label:before {
  content: '❯';
  display: inline-block;
  font-size: 22px;
  color: #949494;
  padding: 10px 27px 10px 27px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  cursor: pointer;
  z-index: 3;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid v-bind(borderColor);
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li.editing {
  border-bottom: none;
  padding: 0;
}

.todo-list li.editing .edit {
  display: block;
  width: calc(100% - 43px);
  padding: 12px 16px;
  margin: 0 0 0 43px;
  opacity: 0.75;
}

.todo-list li.editing .view {
  display: none;
}

.todo-list li .toggle {
  text-align: center;
  width: 40px;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  z-index: 2;
  cursor: pointer;
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
  opacity: 0.75;
}

.todo-list li.completed label {
  color: #949494;
  text-decoration: line-through;
}

.todo-list li .destroy {
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

.todo-list li .destroy:hover,
.todo-list li .destroy:focus {
  color: #C18585;
}

.todo-list li .destroy:after {
  content: '×';
  display: block;
  height: 100%;
  line-height: 1.1;
}

.todo-list li:hover .destroy {
  display: block;
}

.todo-list li .edit {
  display: none;
}

.todo-list li.editing:last-child {
  margin-bottom: -1px;
}

.footer {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  height: auto;
  text-align: center;
  font-size: 15px;
  border-top: 1px solid v-bind(borderColor);
}

.footer:before {
  content: '';
  position: absolute;
  z-index: -1;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
    0 8px 0 -3px v-bind(footerBoxShadowColor),
    0 9px 1px -3px rgba(0, 0, 0, 0.2),
    0 16px 0 -6px v-bind(footerBoxShadowColor),
    0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
  float: left;
  text-align: left;
}

.todo-count strong {
  font-weight: 300;
}

.filters {
  margin: 0;
  padding: 0;
  list-style: none;
}

.filters li {
  display: inline;
}

.filters li a {
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
}

.filters li a:hover {
  border-color: #1772d0;
}

.filters li a.selected {
  border-color: #377BB5;
}

.clear-completed,
html .clear-completed:active {
  position: relative;
  line-height: 19px;
  text-decoration: none;
  cursor: pointer;
}

.clear-completed:hover {
  text-decoration: underline;
}

.info {
  margin: 65px auto 0;
  color: #4d4d4d;
  font-size: 11px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  text-align: center;
}

.info p {
  line-height: 1;
}

.info a {
  color: inherit;
  text-decoration: none;
  font-weight: 400;
}

.info a:hover {
  text-decoration: underline;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {

  .toggle-all,
  .todo-list li .toggle {
    background: none;
  }

  .todo-list li .toggle {
    height: 40px;
  }
}

@media (max-width: 430px) {
  .footer {
    height: 50px;
  }

  .filters {
    bottom: 10px;
  }
}

:focus,
.toggle:focus+label,
.toggle-all:focus+label {
  box-shadow: 0 0 2px 2px #377BB5;
  outline: 0;
  z-index: 3;
}
</style>

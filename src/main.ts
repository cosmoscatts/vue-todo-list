import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './styles/main.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../locales/*.y(a)?ml', { eager: true }))
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(11, yaml ? -5 : -4), value.default]
    }),
)
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})

createApp(App).use(i18n).mount('#app')

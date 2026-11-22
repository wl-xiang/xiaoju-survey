import { createApp } from 'vue'
import { createPinia } from 'pinia'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'

import App from './App.vue'
import router from './router'

import { applyThemeMode, getThemeMode } from './utils/theme'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/theme.scss'

// 在应用挂载前应用主题，默认浅色模式
applyThemeMode(getThemeMode())

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(plainText)
app.use(safeHtml)

app.mount('#app')

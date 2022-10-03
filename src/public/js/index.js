import { createApp } from 'https://unpkg.com/petit-vue?module'

document.addEventListener('DOMContentLoaded', () => {
  createApp({
    uri: '',
    get uri() { return this.uri }
  }).mount()
})
import { createApp } from 'vue'
import vuetify from './vuetify';

import App from './App.vue'

const app = createApp(App);

app.use(vuetify);
app.mount('#app');

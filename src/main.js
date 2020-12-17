import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

import axios from 'axios';
import VueAxios from 'vue-axios';

import store from './store';

Vue.config.productionTip = false;

Vue.use(VueI18n);

Vue.use(ElementUI, {
    size: 'small'
});

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

axios.defaults.baseURL = 'http://10.15.45.174:8080';
axios.defaults.timeout = 1000;
// 添加响应拦截器
axios.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        return response;
    },
    function(error) {
        if (error.response.data) {
            alert(error.response.data.message);
        }
        return Promise.reject(error);
    }
);

Vue.use(VueAxios, axios);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');

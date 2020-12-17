import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    ValidStatus: {
      Valid: '有效',
      Invalid: '无效'
    },

    AdType: {
      Text: '文字',
      Image: '图片',
      SmallImageText: '小图文',
      BigImageText: '大图文',
      ThreeImages: '三图',
      Video: '视频'
    },

    OS: {
      Android: '安桌',
      iOS: '苹果',
      WP: 'WP'
    }
  },

  getters: {
    validList: state => {
      console.log('validList');
      return state.ValidStatus;
    }
  }
});

export default store;

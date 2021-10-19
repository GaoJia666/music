import App from './App'
import store from 'store/index.js'


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app,
		store,
		
	}
}
// #endif


Vue.filter('formatCount', function(value) {
	// 判断在万~亿之间的访问量
	if (value >= 10000 && value < 100000000) {
		value /= 10000;
		return value.toFixed(1) + '万';
	}
	// 大于一亿的时候
	else if (value >= 100000000) {
		value /= 100000000;
		// 末尾加上 ‘亿’
		return value.toFixed(1) + '亿';
	} else {
		return value;
	}

});

Vue.filter('formatTime', function(value) {

	var date = new Date(value);

	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
});

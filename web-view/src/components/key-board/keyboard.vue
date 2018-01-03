<!-- 虚拟软键盘组件 -->
<template>
	<div>
		<vue-touch-keyboard
			:layout="layout"
			:input="input"
			:cancel="cancel"
			:accept="accept" />
	</div>
</template>

<script>
import Vue from 'vue';
import VueTouchKeyboard from "vue-touch-keyboard";
import "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style
import diy_layout from './diy_layout.js';//自定义的键盘布局

Vue.use(VueTouchKeyboard);

export default {
	data() {
		return {
			layout: diy_layout
		}
	},
	props: {
		input: {
			type: [Object, null],
			default: null
		},
		options: {
			type: Object,
			default: () => {
				useKbEvents: false
			}
		},
		cancel: {
			type: Function,
			required: true
		},
		accept: {
			type: Function,
			required: true
		}
	}
}
</script>

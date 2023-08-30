Vue.component('dropdown',{
	props: ["title","container_class","header_class"],
	template: `<div class="dropdown" :class="(visible)?'visible':'hidden'">
		<a class="dropdown-header" :class="header_class" @click="visible = !visible">
			{{title}}
			<i class="fa-solid fa-chevron-up"></i>
		</a>
		<div class="dropdown-container" :class="container_class" v-if="visible == true">
			<slot></slot>
		</div>
	</div>`,
	data() {
		return {
			visible: true
		};
	}
});
Vue.component('mrz-component', {
    props: ['rows'],
    template: `<div class="placeholder mrz" title="Machine Readable Zone">
		<div>
			<center v-for="row in rows" v-if="row.length > 0" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{row}}</center>
		</div>
	</div>`,});
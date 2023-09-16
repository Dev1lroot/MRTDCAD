Vue.component('vis-component', {
    props: ['page','photo_is_allowed','document_header'],
    template: `
	<div class="content">
		<div class="placeholder title" v-if="$parent.render_mode == 1" @click="$parent.properties($parent.fields[0])">
			<center>{{$parent.select("countryname")}}</center>
		</div>
		<div class="vis">
			<div class="aside-photo" v-if="photo_is_allowed">
				<div class="row" v-if="document_header">
					<div class="placeholder field" @click="$parent.properties($parent.fields[1])">{{$parent.select("document")}}</div>
				</div>
				<div class="row">
					<div class="flex-center photo" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">
						<div class="placeholder photo" :style="'background-image:url('+$parent.credentials.photo+')'">
							<input type="file" id="gp" v-on:input="$parent.getFile('#gp',function(e){$parent.credentials.photo = e})">
						</div>
					</div>
				</div>
			</div>
			<draggable class="fields draggable" v-model="$parent.layout[page]" group="vis-row">
				<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0" v-for="row,rowid in $parent.layout[page]">
					<parameter 
						v-for="col in row" 
						v-bind:param="col"
						v-bind:global_styles="$parent.style"
					></parameter>
				</draggable>
			</draggable>
		</div>
	</div>`,});
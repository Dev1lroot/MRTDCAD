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
						<div class="placeholder photo" :style="'background-image:url('+$parent.photo+')'">
							<input type="file" id="gp" v-on:input="$parent.getFile('#gp',function(e){$parent.photo = e})">
						</div>
					</div>
				</div>
			</div>
			<draggable class="fields draggable" v-model="$parent.layout[page]">
				<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0" v-for="row,rowid in $parent.layout[page]">
					<div v-for="col in row" :title="col.title" @click="$parent.properties(col)" :style="'width:'+col.width+'mm;'" class="placeholder field">
						<label :style="'color: '+$parent.style.labels.color+'; font-size: '+$parent.style.labels.fontSize+'px'">{{col.title}}</label>
						<p :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{col.value}}</p>
					</div>
				</draggable>
			</draggable>
		</div>
	</div>`,});
Vue.component('military-component', {
    props: ['page','photo_is_allowed','document_header','pdf417'],
    template: `
	<div class="content">
		<div class="vis">
			<div class="aside-photo" v-if="photo_is_allowed">
				<div class="row">
					<div class="flex-center photo" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">
						<div class="placeholder photo" :style="'background-image:url('+$parent.credentials.photo+')'">
							<input type="file" id="gp" v-on:input="$parent.getFile('#gp',function(e){$parent.credentials.photo = e})">
						</div>
					</div>
					<div class="flex-center photo division" :style="($parent.style.personalization) ? '' : 'opacity: 0;'">
						<div class="placeholder photo" :style="'background-image:url('+$parent.credentials.division+')'">
							<div class="countryname" v-if="$parent.render_mode == 1" @click="$parent.properties($parent.fields[0])">
								<center>{{$parent.select("countryname")}}</center>
							</div>
							<input type="file" id="gp2" v-on:input="$parent.getFile('#gp2',function(e){$parent.credentials.division = e})">
							<div class="deputyname" v-if="$parent.render_mode == 1" @click="$parent.properties($parent.fields[2])">
								<center>{{$parent.select("deputyname")}}</center>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="page == 0">
			<div class="vis">
				<draggable class="fields draggable" v-model="$parent.layout[page]" group="vis-row">
					<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0 && rowid < 2" v-for="row,rowid in $parent.layout[page]">
						<div v-for="col in row" :title="col.title" @click="$parent.properties(col)" :style="'width:'+col.width+'mm;'" class="placeholder field">
							<label :style="'color: '+$parent.style.labels.color+'; font-size: '+$parent.style.labels.fontSize+'px'">{{col.title}}</label>
							<p :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{col.value}}</p>
						</div>
					</draggable>
				</draggable>
			</div>
			<div class="aside-pdf417">
				<canvas id="pdf417"></canvas>
				<div>
					<draggable class="fields draggable" v-model="$parent.layout[page]" group="vis-row">
						<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0 && rowid >= 2" v-for="row,rowid in $parent.layout[page]">
							<div v-for="col in row" :title="col.title" @click="$parent.properties(col)" :style="'width:'+col.width+'mm;'" class="placeholder field">
								<label :style="'color: '+$parent.style.labels.color+'; font-size: '+$parent.style.labels.fontSize+'px'">{{col.title}}</label>
								<p :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{col.value}}</p>
							</div>
						</draggable>
					</draggable>
				</div>
			</div>
		</div>
		<div v-else="" class="vis">
			<draggable class="fields draggable" v-model="$parent.layout[page]" group="vis-row">
				<draggable :list="$parent.layout[page][rowid]" group="vis" v-model="$parent.layout[page][rowid]" class="row" v-if="$parent.layout.length > 0" v-for="row,rowid in $parent.layout[page]">
					<div v-for="col in row" :title="col.title" @click="$parent.properties(col)" :style="'width:'+col.width+'mm;'" class="placeholder field">
						<label :style="'color: '+$parent.style.labels.color+'; font-size: '+$parent.style.labels.fontSize+'px'">{{col.title}}</label>
						<p :style="($parent.style.personalization) ? '' : 'opacity: 0;'">{{col.value}}</p>
					</div>
				</draggable>
			</draggable>
		</div>
	</div>`,});
Vue.component('background-component',{
	props: ["page"],
	template: `<div class="background">
		<div class="layer" 
			v-for="layer,id in $parent.background" 
			:style="\`z-index:\`+(993 - id)+\`;background-image:url(\${layer.image});filter: brightness(\${layer.brightness})contrast(\${layer.contrast})blur(\${layer.blur}px)hue-rotate(\${layer.hue}deg);opacity:\${layer.opacity};\`" 
			v-if="layer.active && (layer.pageBound == false || (layer.pageBound == true && layer.pageNumber == page))">
		</div>
		<div class="layer" style="background-color: #FFF;"></div>
	</div>`})
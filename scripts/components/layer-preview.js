Vue.component('layer-preview',{
	props: ["layer"],
	template: `
		<a 
            class="preview" 
            :style="\`;background-image:url(\${layer.image});filter: brightness(\${layer.brightness})contrast(\${layer.contrast})blur(\${layer.blur}px)hue-rotate(\${layer.hue}deg);opacity:\${layer.opacity};\`">
                <slot></slot>
        </a>`})
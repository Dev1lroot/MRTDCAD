Vue.component('parameter', {
    props: ["param","global_styles"],
    template: `
	<div class="placeholder field" :style="primaryStyle" :title="param.title" @click="properties()">
        <label :style="labelStyle">{{param.title}}</label>
        <p :style="valueStyle">{{param.value}}</p>
    </div>`,
    methods: {
        properties(){
            root.properties(this.param);
        }
    },
    computed: {
        primaryStyle(){
            return {
                width: this.param.width+'mm',
            }
        },
        labelStyle(){
            return {
                color: this.global_styles.labels.color,
                fontSize: this.global_styles.labels.fontSize+'px'
            }
        },
        valueStyle(){
            return {
                opacity: (this.global_styles.personalization) ? 1 : 0
            }
        }
    }
});
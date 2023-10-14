Vue.component('parameter', {
    props: ["param","global_styles"],
    template: `
	<div class="placeholder field" :class="'field-'+fieldClass" :style="primaryStyle" :title="param.title" @click="properties()">
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
        fieldClass(){
            return this.global_styles.vis.class;
        },
        labelStyle(){
            return {
                color: this.global_styles.labels.color,
                fontSize: this.global_styles.labels.fontSize+'px',
                fontFamily: (this.global_styles.labels.hasOwnProperty("fontFamily")) ? this.global_styles.labels.fontFamily : "Frutiger",
            }
        },
        valueStyle(){
            return {
                opacity: (this.global_styles.personalization) ? 1 : 0,
                fontFamily: this.global_styles.params.fontFamily,
                fontSize: (this.global_styles.params.hasOwnProperty("fontSize")) ? this.global_styles.params.fontSize + "px" : "13px",
                letterSpacing: (this.global_styles.params.hasOwnProperty("letterSpacing")) ? this.global_styles.params.letterSpacing + "px" : "0px"
            }
        }
    }
});
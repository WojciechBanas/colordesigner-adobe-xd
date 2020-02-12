<template>
    <div class="color-palette">
        <div class="color-palette__active-color" :style="'background:' + activeColor.hex" />
        <div class="color-palette__color-list">
            <div v-for="(color,index ) of colors" :key="index" class="color-palette__color" :style="'background:' + color.value" @click="changeActiveColor(index)" :title="color.name"/>
        </div>
        selection
        <div class="color-palette__color-list">
            <div v-for="(color,index ) of colorsFromSelection" :key="index" class="color-palette__color" :style="'background:' + color.value" @click="changeActiveColor(index)" :title="color.name"/>
        </div>
        <div class="color-palette__actions">
            <button uxp-variant="cta" @click="showPaletteOnline" v-if="this.colors">View Online</button>
        </div>
    </div>
</template>
<script>
const chroma = require('chroma-js')
const shell = require("uxp").shell
const mapState = require('vuex').mapState
const mapMutations = require('vuex').mapMutations
const mapGetters = require('vuex').mapGetters
const tabsMixin = require('./../tabs.js')

const TabsNav = require('./tabs/TabsNav.vue').default
const Tabs = require('./tabs/Tabs.vue').default
const Tab = require('./tabs/Tab.vue').default

export default {
    components: {
        TabsNav,
        Tabs,
        Tab
    },
    computed: {
        ...mapState(['colors','colorsFromSelection', 'activeColorIndex', 'activeColor']),
        ...mapGetters(['activeColor'])
    },
    data() {
        return {
            dialogVisible: false
        }
    },
    mounted() {
    },
    methods: {
        openOnlinePalette(){
            shell.openExternal('https://colordesigner.io/')
        },
        showPaletteOnline() {

            let colors = this.colors.map((color)=>{
                return chroma(color.value).hex().substring(1)
            })
            colors = colors.join('-')
            shell.openExternal(`https://colordesigner.io/?presentationMode=true&from=adobexd#${colors}`)
        },
        handleTabChange(tab) {
            this.activeTab = tab
            if(tab === 'local-styles'){
                this.getColorsFromLibrary()
            }else{
                this.getColorsFromSelection()
            }
        },
        ...mapMutations(['changeActiveColor'])
    },
    filters: {
        formatColor(color) {
            return color.match(/[\d,%.]+/)[0]
        }
    },
    mixins: [tabsMixin]
}
</script>

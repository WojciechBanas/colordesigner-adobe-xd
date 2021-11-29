<template>
    <div class="color-palette">
        <div class="color-palette__active-color" :style="'background:' + activeColor.hex" />
        <TabsNav :tabsList="colorSourceTabs" size="sm" @tabChange="handleColorSourceTabChange" :activeTab="activeColorSourceTab"></TabsNav><tabs :activeTab="activeColorSourceTab">
            <tab name="assets">
                <div class="color-palette__color-list">
                    <div v-for="(color,index) of colorsFromAssets" :key="index" class="color-palette__color" :style="'background:' + color.value" @click="changeActiveColor(index)" :title="color.name"/>
                </div>
            </tab>
            <tab name="selected-layers">
                <div class="color-palette__color-list">
                    <div v-for="(color,index) of colorsFromSelectedLayers" :key="index" class="color-palette__color" :style="'background:' + color.value" @click="changeActiveColor(index)" :title="color.name"/>
                </div>
                <div class="color-palette__no-data" v-if="noSelectedLayers">
                    <h4 class="color-palette__no-data-title">No Colors</h4>
                    <p  class="color-palette__no-data-desc">Select items and open the plugin again</p>
                </div>
            </tab>
        </tabs>
        <div class="color-palette__actions">
            <button uxp-variant="cta" @click="showPaletteOnline" v-if="colorsFromAssets">View Online</button>
        </div>
    </div>
</template>
<script>
const chroma = require('chroma-js')
const shell = require("uxp").shell
const mapState = require('vuex').mapState
const mapMutations = require('vuex').mapMutations
const mapGetters = require('vuex').mapGetters
const tabsMixin = require('./../tabs.js').default

const TabsNav = require('./tabs/TabsNav.vue').default
const Tabs = require('./tabs/Tabs.vue').default
const Tab = require('./tabs/Tab.vue').default

export default {
    mixins: [tabsMixin],
    components: {
        TabsNav,
        Tabs,
        Tab
    },
    computed: {
        ...mapState(['colorsFromAssets','colorsFromSelectedLayers', 'activeColorIndex', 'activeColor', 'noSelectedLayers']),
        ...mapGetters(['activeColor'])
    },
    data() {
        return {
            dialogVisible: false
        }
    },
    methods: {
        openOnlinePalette(){
            shell.openExternal('https://colordesigner.io/')
        },
        showPaletteOnline() {
            let colors
            if(this.activeColorSourceTab === 'selection'){
                colors = this.colorsFromSelectedLayers.map((color)=>{
                    return chroma(color.value).hex().substring(1)
                })
            }else{
                colors = this.colorsFromAssets.map((color)=>{
                    return chroma(color.value).hex().substring(1)
                })
            }
            colors = colors.join('-')
            shell.openExternal(`https://colordesigner.io/?presentationMode=true&from=adobexd#${colors}`)
        },
        handleTabChange(tab) {
            this.activeTab = tab
            if(tab === 'local-styles'){
                this.getColorsFromLibrary()
            }else{
                this.getColorsFromSelectedLayers()
            }
        },
        ...mapMutations(['changeActiveColor', 'setActiveColorTab'])
    },
    filters: {
        formatColor(color) {
            return color.match(/[\d,%.]+/)[0]
        }
    }
}
</script>

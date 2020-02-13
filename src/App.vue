<template>
    <div class="dialog">
        <div class="dialog__header">
            <h1 class="dialog__title">Color Designer</h1>
            <hr>
            <div class="dialog__nav">
                <TabsNav :tabsList="mainTabs"  @tabChange="handleMainTabChange" :activeTab="activeMainTab"></TabsNav>
                <a href="https://colordesigner.io/tools?ref=adobexd" class="dialog__more-tools">More Tools</a>
            </div>
        </div>
        <div class="dialog__body">
            <div class="dialog__sidebar">
                <ColorPalette />
            </div>
            <div class="dialog__content">
                <tabs :activeTab="activeMainTab">
                    <tab name="shades-tints">
                        <TabsNav :tabsList="shadesTabs" @tabChange="handleShadeTabChange" :activeTab="activeShadesTab"></TabsNav>
                        <tabs :activeTab="activeShadesTab">
                            <tab name="tints">
                                <div class="dialog__section">
                                    <h2 class="dialog__section-title">Tints</h2>
                                    <RangeSlider :min="1" :max="40" :start="15" @update="updateTintsValue" />
                                    <ColorList :colors="tints" @colorSelect="selectColor" @showImages="openImagesList" />
                                </div>
                            </tab>
                            <tab name="shades">
                                <div class="dialog__section">
                                    <h2 class="dialog__section-title">Shades</h2>
                                    <RangeSlider :min="1" :max="40" :start="15" @update="updateShadesValue" />
                                    <ColorList :colors="shades" @colorSelect="selectColor" @showImages="openImagesList" />
                                </div>
                            </tab>
                            <tab name="color-harmonies">
                                <div class="dialog__section">
                                    <h2 class="dialog__section-title">Color Harmonies</h2>
                                    <TabsNav :tabsList="colorHarmoniesTabs" size="sm" @tabChange="handleColorHarmoniesTabChange" :activeTab="activeColorHarmoniesTab"></TabsNav>
                                    <tabs :activeTab="activeColorHarmoniesTab">
                                        <tab name="complementary">
                                            <ColorList :colors="colorHarmonies.complementary" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                        <tab name="analogous">
                                            <ColorList :colors="colorHarmonies.analogous" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                        <tab name="split-complementary">
                                            <ColorList :colors="colorHarmonies.splitComplementary" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                        <tab name="triad">
                                            <ColorList :colors="colorHarmonies.triad" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                        <tab  name="square">
                                            <ColorList :colors="colorHarmonies.square" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                        <tab name="rectangle">
                                            <ColorList :colors="colorHarmonies.rectangle" @colorSelect="selectColor" @showImages="openImagesList"/>
                                        </tab>
                                    </tabs>
                                </div>
                            </tab>
                        </tabs>
                    </tab>
                    <tab name="color-picker">
                        <TabsNav :tabsList="colorsTabs" @tabChange="handleNewColorTabChange"  :activeTab="activeColorsTab"></TabsNav>
                        <tabs :activeTab="activeColorsTab">
                            <tab name="green">
                                <ColorSwatches :colors="swatches.green" @selectColor="selectColor" />
                            </tab>
                            <tab name="blue">
                                <ColorSwatches :colors="swatches.blue" @selectColor="selectColor" />
                            </tab>
                            <tab name="red">
                                <ColorSwatches :colors="swatches.red" @selectColor="selectColor" />
                            </tab>
                            <tab name="orange">
                                <ColorSwatches :colors="swatches.orange" @selectColor="selectColor" />
                            </tab>
                            <tab name="purple">
                                <ColorSwatches :colors="swatches.purple" @selectColor="selectColor" />
                            </tab>
                            <tab name="yellow">
                                <ColorSwatches :colors="swatches.yellow" @selectColor="selectColor" />
                            </tab>
                            <tab name="grey">
                                <ColorSwatches :colors="swatches.grey" @selectColor="selectColor" />
                            </tab>
                        </tabs>
                    </tab>
                    <tab name="images">
                        <ImagesList></ImagesList>
                    </tab>
                </tabs>
            </div>
        </div>
        <ImagesListModal :visible="imagesListModal" :color="imagesListModalColor" @hide="imagesListModal = false"/>
        <footer class="dialog__footer">
            <button uxp-variant="primary" @click="closePlugin">Close</button>
        </footer>
        <Modal :open="addToAssetsModal" @hide="addToAssetsModal = false">
            <div class="color-info">
                <div class="color-info__color" :style="'background:' + selectedColor">
                </div>
                <div class="color-info__name">
                    <label>Color name: </label>
                    <input v-model="selectedColorName">
                </div>
                <div class="color-info__action">
                    <button ref="addColorToAssetsButton" uxp-variant="cta" @click="addColorToAssets">Add Color To Assets</button>
                    <button ref="addColorToAssetsButton" uxp-quiet="true" @click="addToAssetsModal = false">Close</button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
const assets = require("assets")
const { Color } = require("scenegraph")

const mapState = require('vuex').mapState
const mapMutations = require('vuex').mapMutations
const mapGetters = require('vuex').mapGetters

const ColorPalette = require('./components/ColorPalette.vue').default
const ColorList = require('./components/ColorList.vue').default
const RangeSlider = require('./components/RangeSlider.vue').default
const Modal = require('./components/Modal.vue').default
const ColorSwatches = require('./components/ColorSwatches.vue').default
const ImagesList = require('./components/ImagesList.vue').default
const ImagesListModal = require('./components/ImagesListModal.vue').default


const TabsNav = require('./components/tabs/TabsNav.vue').default
const Tabs = require('./components/tabs/Tabs.vue').default
const Tab = require('./components/tabs/Tab.vue').default

const getTints = require('./utils/color-utils.js').getTints
const getShades = require('./utils/color-utils.js').getShades
const getColorHarmonies = require('./utils/color-utils.js').getColorHarmonies
const swatches = require('./utils/swatches.js').default

const tabsMixin = require('./tabs.js').default

module.exports = {
    props: {
        dialog:{
            type: Object
        }
    },
    data() {
        return {
            tints: [],
            tintsValue: 15,
            shades: [],
            swatches,
            shadesValue: 15,
            colorHarmonies: [],
            addToAssetsModal: false,
            imagesListModal: false,
            imagesListModalColor: '#000000',
            selectedColor: '#000000',
            selectedColorName: ''
        }
    },
    computed: {
        ...mapState(['colors', 'activeColorIndex', 'presentationMode', 'activeColorSourceTab']),
        ...mapGetters(['activeColor'])
    },
    components:{
        ColorPalette,
        ColorList,
        RangeSlider,
        Modal,
        TabsNav,
        Tabs,
        Tab,
        ColorSwatches,
        ImagesList,
        ImagesListModal
    },
    mounted() {
        this.generateTints()
        this.generateShades()
        this.generateColorHarmonies()
    },
    methods: {
        generateTints() {
            this.tints = getTints(this.activeColor.hex, this.tintsValue)
        },
        updateTintsValue(value) {
            this.tintsValue = value
        },
        generateShades(steps = 15) {
            this.shades = getShades(this.activeColor.hex, this.shadesValue)
        },
        generateColorHarmonies() {
            this.colorHarmonies = getColorHarmonies(this.activeColor.hex)
        },
        updateShadesValue(value) {
            this.shadesValue = value
        },
        selectColor(color){
            this.addToAssetsModal = true
            this.selectedColor = color
            this.selectedColorName = color
        },
        openImagesList(color) {
            this.imagesListModal = true
            this.imagesListModalColor = color
        },
        addColorToAssets(){

            return new Promise((resolve, reject) => {

                const newColor  = new Color(this.selectedColor)
                assets.colors.add([
                    { name: this.selectedColorName, color: newColor }
                ])
                this.loadColorsFromAssets()
                this.addToAssetsModal = false

            });
        },
        closePlugin() {
            this.dialog.close()
        },
        ...mapMutations(['loadColorsFromAssets', 'toggleStockPromo'])
    },
    watch: {
        activeColorIndex() {
            this.generateTints()
            this.generateShades()
            this.generateColorHarmonies()
        },
        colorsFromAssets() {
            this.generateTints()
            this.generateShades()
            this.generateColorHarmonies()
        },
        colorsFromSelection() {
            this.generateTints()
            this.generateShades()
            this.generateColorHarmonies()
        },
        activeColorSourceTab(){
            this.generateTints()
            this.generateShades()
            this.generateColorHarmonies()
        },
        tintsValue() {
            this.generateTints()
        },
        shadesValue() {
            this.generateShades()
        }
    },
    mixins: [tabsMixin]
}
</script>

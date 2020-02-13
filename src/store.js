const Vuex = require('vuex')
const uniqBy = require('lodash/uniqBy')
const { Color } = require("scenegraph")
const assets = require("assets")
const convertColorTo = require('./utils/color-utils.js').convertColorTo



const createStore = () => {
    return new Vuex.Store({
        state: {
            activeColorsTab: 'assets',
            noSelection: true,
            colorsFromAssets: [],
            colorsFromSelection: [],
            activeColorIndex: 0,
            presentationMode: false,
            stockPromo: false,
            cachedImages: {}
        },
        getters: {
            activeColor(state) {
                if(state.activeColorsTab === 'selection'){
                    const rgbValue = convertColorTo(
                        state.colorsFromSelection[state.activeColorIndex].value,
                        'rgb'
                    )
                    const hslValue = convertColorTo(
                        state.colorsFromSelection[state.activeColorIndex].value,
                        'hsl'
                    )
                    return {
                        hex: state.colorsFromSelection[state.activeColorIndex].value,
                        rgb: rgbValue,
                        hsl: hslValue
                    }

                }else{
                    const rgbValue = convertColorTo(
                        state.colorsFromAssets[state.activeColorIndex].value,
                        'rgb'
                    )
                    const hslValue = convertColorTo(
                        state.colorsFromAssets[state.activeColorIndex].value,
                        'hsl'
                    )
                    return {
                        hex: state.colorsFromAssets[state.activeColorIndex].value,
                        rgb: rgbValue,
                        hsl: hslValue
                    }
                }
            }
        },
        mutations: {
            setColor(state, color) {
                Vue.set(state.colorsFromAssets, state.activeColorIndex, color)
            },
            setColors(state, colors) {
                state.colorsFromAssets = colors
            },
            changeActiveColor(state, index) {
                state.activeColorIndex = index
            },
            loadColorsFromAssets(state){

                let colors = assets.colors.get().filter((color, index, array)=>{
                    if(color.color){
                        return true
                    }else {
                        return false
                    }
                })
                if(colors.length){

                    colors = colors.map((color)=>{
                        return {
                            name: color.name ? color.name : '',
                            value: new Color(color.color.value).toHex()
                        }
                    })

                    colors = uniqBy(colors, 'value')

                    state.colorsFromAssets = colors

                }else{
                    state.colorsFromAssets = [{
                        name: '',
                        value: new Color('#000').toHex()
                    }]
                }
            },
            loadColorsFromSelection(state, colors){
                if(colors.length){
                    state.activeColorIndex = 0
                    state.colorsFromSelection = colors
                    state.noSelection = false
                }else{
                    state.noSelection = true
                    state.colorsFromSelection = [{
                        name: '',
                        value: new Color('#000').toHex()
                    }]
                }
            },
            cacheImages(state, {phrase, images}){
                state.cachedImages[phrase] = images
            },
            removeCachedImages(state){
                state.cachedImages = {}
            },
            toggleStockPromo(state, show) {
                if(show){
                    state.stockPromo = true
                }else{
                    state.stockPromo = false
                }
            },
            setActiveColorTab(state, name) {
                state.activeColorsTab = name
            }
        }
    })
}

module.exports = createStore

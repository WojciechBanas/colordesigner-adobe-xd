const Vuex = require('vuex')
const uniqBy = require('lodash/uniqBy');
const { Color } = require("scenegraph")
const assets = require("assets")
const convertColorTo = require('./utils/color-utils.js').convertColorTo



const createStore = () => {
    return new Vuex.Store({
        state: {
            colors: [],
            activeColorIndex: 0,
            presentationMode: false,
            stockPromo: false,
            cachedImages: {}
        },
        getters: {
            activeColor(state) {
                const rgbValue = convertColorTo(
                    state.colors[state.activeColorIndex].value,
                    'rgb'
                )
                const hslValue = convertColorTo(
                    state.colors[state.activeColorIndex].value,
                    'hsl'
                )
                return {
                    hex: state.colors[state.activeColorIndex].value,
                    rgb: rgbValue,
                    hsl: hslValue
                }
            }
        },
        mutations: {
            setColor(state, color) {
                Vue.set(state.colors, state.activeColorIndex, color)
            },
            setColors(state, colors) {
                state.colors = colors
            },
            changeActiveColor(state, index) {
                state.activeColorIndex = index
            },
            loadColors(state){

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
                    state.colors = colors
                }else{
                    state.colors = [{
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
        }
    })
}

module.exports = createStore

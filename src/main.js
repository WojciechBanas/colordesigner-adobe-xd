const Vue = require('vue').default
const Vuex = require('vuex')
const { Color } = require("scenegraph")
const findIndex = require('lodash/findIndex');
Vue.use(Vuex)
const styles = require('./scss/main.scss')
const App = require('./App.vue').default
const store = require('./store.js')()



let selectedNodes = []
let colorsFromSelectedLayers = []
function getChildren(children){
    children.forEach(node => {
        selectedNodes.push(node)
        if(node.children.length){
            getChildren(node.children)
        }
    })
}

function getcolorsFromSelectedLayers(items){
    selectedNodes = []
    colorsFromSelectedLayers = []
    for(const node of items){
        selectedNodes.push(node)
        if(node.children.length){
            getChildren(node.children)
        }
    }
    for(const node of selectedNodes) {

        if(node.fill){
            const fillColor = new Color(node.fill.value).toHex()
            if(findIndex(colorsFromSelectedLayers, {value:fillColor}) === -1){
                colorsFromSelectedLayers.push({
                    name: `${fillColor} - ${node.name} (fill)`,
                    value: fillColor
                })
            }
        }

        if(node.stroke){
            const strokeColor = new Color(node.stroke.value).toHex()
            if(findIndex(colorsFromSelectedLayers, {value:strokeColor})  === -1){
                colorsFromSelectedLayers.push({
                    name: `${strokeColor} - ${node.name} (stroke)`,
                    value: strokeColor
                })
            }
        }

    }
}


let dialog
function getDialog(selectedLayers) {
    getcolorsFromSelectedLayers(selectedLayers.items)
    store.commit('changeActiveColor',0)
    store.commit('loadcolorsFromSelectedLayers', colorsFromSelectedLayers)
    store.commit('setActiveColorTab', 'selected-layers')
    if (dialog == null) {
        document.body.innerHTML = `<dialog><div id="container"></div></dialog>`
        dialog = document.querySelector('dialog')
        store.commit('loadColorsFromAssets')
        new Vue({
            el: '#container',
            components: { App },
            store,
            render(h) {
                return h(App, { props: { dialog } })
            }
        })
    }else{
        store.commit('loadColorsFromAssets')
    }

    return dialog
}

module.exports = {
    commands: {
        showColorDesignerDialog:  async function(selectedLayers) {
            await getDialog(selectedLayers).showModal();
        }
    }
}

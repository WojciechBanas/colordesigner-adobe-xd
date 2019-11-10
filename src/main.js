const Vue = require('vue').default
const Vuex = require('vuex')

Vue.use(Vuex)
const styles = require('./scss/main.scss')
const App = require('./app.vue').default
const store = require('./store.js')()


let dialog
function getDialog() {

    if (dialog == null) {
        document.body.innerHTML = `<dialog><div id="container"></div></dialog>`
        dialog = document.querySelector('dialog')
        store.commit('loadColors')
        new Vue({
            el: '#container',
            components: { App },
            store,
            render(h) {
                return h(App, { props: { dialog } })
            }
        })
    }else{
        store.commit('loadColors')
    }

    return dialog
}

module.exports = {
    commands: {
        showColorDesignerDialog:  async function(selection) {
            await getDialog().showModal();
        }
    }
}

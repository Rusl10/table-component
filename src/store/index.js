import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	products: null
  },
  mutations: {
  	addProducts(state, products){
		state.products = products
	},
	deleteProducts(state, productsToDel){
		try{
			productsToDel.forEach(productId => {
				const productInd = state.products.findIndex(x => x.id === productId)
				state.products.splice(productInd, 1)
			})	
		} catch(e){
			console.log('error in deleteProducts', e)
		}
	}
  },
  getters: {
  	products: s => s.products
  }
})

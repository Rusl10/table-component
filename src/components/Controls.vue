<template>
	<div>
		<div class="controls">
			<div class="controls__sorting">Sorting by:</div>
			<ul class="controls_select-column select-column">
				<li class="select-column__item"
				v-for="column in displaySortingListFrom"
				@click="sortBy(column.value)"
				:class="{'select-column__item--active': sortKey === column.value}"
				>{{ column.name }}</li>
			</ul>
			<div class="controls__tools">
				<button class="button tools__delete"
				:class="{'tools__delete--active': rowsToDelete }"
				@click="sendConfirmToDel"
				>Delete{{ del }}</button>
				<select class="select tools__select"
				v-model="productsPerPage"
				:disabled="rowsToDelete"
				:class="{'tools__select--disabled': rowsToDelete}"
				>
					<option :value="variant"
					v-for="variant of variantsAmountPerPage"
					>{{ variant }} Per Page</option>
				</select> 
				<div class="pagination">
					<button class="pagination__btn pagination__prev"
					@click="movePages(-1)"
					:class="{'pagination__btn--disabled': pageNumber === 1 || rowsToDelete
					}"
					></button>
					<div class="pagination__pages pages"><span class="pages__items pages__items--per-page">{{ listOfProducts.from + 1 }}- {{ listOfProducts.to }}</span> of <span class="pages__items pages__items--total">{{ products ? products.length : '' }}</span></div>
					<button class="pagination__btn pagination__next"
					@click="movePages(1)"
					:class="{'pagination__btn--disabled': pageNumber === amoutOfPages || rowsToDelete
					}"
					></button>
				</div> 
				<div class="select tools__select select-columns"
				@click="showDropdown($event.target)"
				:class="{ 'select-columns--active': activeTrigger }"
				>
					<span class="select-columns__title">{{checkedColumns.length}} columns selected</span>
					<div class="select-columns__arrow"></div>
					<div class="dropdown"
					:class="{ 'dropdown--active': activeTrigger }"
					>
						<ul class="dropdown__list">
							<li class="dropdown__item">
								<div class="checkbox-select__check-wrapp">
									<input id="selectAll" class="conditions-check" @click="selectAll" v-model="allSelected" type="checkbox">
									<label for="selectAll">{{selectAllText}}</label>
								</div>
							</li>
							<li class="dropdown__item"
							v-for="(column, index) in columns">
								<div class="checkbox-select__check-wrapp"
								@click="sendColumnsForDisplaying"
								>
									<input class="conditions-check" type="checkbox"
									v-model="checkedColumns" 
									:value="column"
									:id="index">
									<label :for="index">{{column.name}}</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default{
	name: 'Controls',
	props: ['rowsToDelete'],
	data(){
		return {
			sortKey: '',
			columns: [
			{value: 'product', name: 'Product (100g serving)'}, {value: 'calories', name: 'Calories'}, {value: 'fat', name: 'Fat (g)'}, {value: 'carbs', name: 'Carbs (g)'}, {value: 'protein', name: 'Protein (g)'}, {value: 'iron', name: 'Iron (%)'}
			],
			checkedColumns: null,
			productsPerPage: 10,
			pageNumber: 1,
			variantsAmountPerPage: [10, 20, 50, 100],
			allSelected: true,
      		selectAllText: 'Clear All',
			activeTrigger: false
		}
	},
	computed: {
		...mapGetters(['products']),
		del(){
			return this.rowsToDelete ? '(' + this.rowsToDelete + ')' : ''
		},
		amoutOfPages(){
			return this.products ? Math.ceil(this.products.length / this.productsPerPage) : null 
		},
		listOfProducts(){
			if(((this.pageNumber - 1) * this.productsPerPage) > 1000){ this.pageNumber = 1
			}	
			let from = (this.pageNumber - 1) * this.productsPerPage 
			let to = from + this.productsPerPage
			return {from, to}
		},
		displaySortingListFrom(){
			return this.checkedColumns === null ? this.columns : this.checkedColumns
		}
	},
	watch: {
		products(products){
			this.sendIntervalToDisplay()
		},
		listOfProducts(fromTo){
			this.sendIntervalToDisplay()
		}
	},
	methods: {
		sortBy(column){
			this.sortKey = column
			this.$emit('sortBy', column)
		},
		movePages(moveTo){
			if (!this.displaySortingListFrom.length || this.rowsToDelete) {
				return
			}
			var newPageNumber = this.pageNumber + (moveTo)
			if (newPageNumber >= 1 && newPageNumber <= this.amoutOfPages) {
				this.pageNumber = newPageNumber
			}
		},
		selectAll() {
			this.checkedColumns = []
			this.selectAllText = this.selectAllText == "Select All" ? 'Clear All' : 'Select All'
			if (!this.allSelected) { 		
				this.checkedColumns = this.columns.slice(0)	
			}
			this.sendSelectedColumns()
		},
		showDropdown(target){
			if (target.classList.contains('dropdown') || target.closest('.dropdown')) {
				return
			}
			if(!this.activeTrigger){
				this.activeTrigger = true
			} else{
				this.activeTrigger = false
			}

		},
		sendColumnsForDisplaying(){
			setTimeout(() => {
				this.sendSelectedColumns()
			}, 0)
		},
		sendConfirmToDel(){
			if (!this.rowsToDelete) return
			this.$emit('sendConfirmToDel')
		},
		sendSelectedColumns(){
			this.$emit('sendSelectedColumns', this.checkedColumns)
		},
		sendIntervalToDisplay(){
			this.$emit('intervalToDisplay', this.listOfProducts)
		}
	},
	created(){
		this.checkedColumns = this.columns.slice(0)
	}
}	
</script>
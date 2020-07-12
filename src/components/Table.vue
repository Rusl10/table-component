<template>
	<div>
		<table class="table">
			<thead class="table__thead">
					<th class="table__th"
					v-if="displayColumnsFrom.length"
					>
						<input type="checkbox"
						v-model="selectedAllRows"
						@click="selectAllRows"
						/>
					</th>
					<th class="table__th"
					v-for="column in displayColumnsFrom"
					><span class="table__th-content"
					@click="orderBy"
					:class="{'table__th-content--active': columnForSorting === column.value}"
					>{{ column.name }}</span></th>
			</thead>
			<tbody class="table__tbody">
				<tr class="table__tr" v-for="product in sortColumns">
					<td class="table__td"
					v-if="displayColumnsFrom.length"
					>
						<input type="checkbox" class="table__checkbox"
						:value="product.id"
						v-model="selected"
						>
					</td>
					<td class="table__td"
					v-for="column in displayColumnsFrom"
					>{{ product[column.value] }}</td>
				</tr>
			</tbody>
		</table>   
	</div>
</template>

<script>
import { mapGetters } from 'vuex'	
export default {
	name: 'Table',
	props: ['interval', 'columnForSorting', 'columnsToDisplaying'],
	data(){
		return {
			columns: [
			{value: 'product', name: 'Product (100g serving)'}, {value: 'calories', name: 'Calories'}, {value: 'fat', name: 'Fat (g)'}, {value: 'carbs', name: 'Carbs (g)'}, {value: 'protein', name: 'Protein (g)'}, {value: 'iron', name: 'Iron (%)'}
			],
			currentSortDir: 'asc',
			selected: [],
			selectedAllRows: false
		}
	},
	computed: {
		...mapGetters(['products']),
		listOfProducts(){
			return this.products && this.interval ? this.products.slice(this.interval.from, this.interval.to) : ''
		},
		sortColumns(){
			if(typeof this.listOfProducts === 'object'){
				return this.listOfProducts.sort((a,b) => {
					let modifier = 1
					if(this.currentSortDir === 'desc') modifier = -1
					if(a[this.columnForSorting] < b[this.columnForSorting]) return -1 * modifier
					if(a[this.columnForSorting] > b[this.columnForSorting]) return 1 * modifier
					return 0
				})
			} else { return '' }
		},
		displayColumnsFrom(){
			return this.columnsToDisplaying === null ? this.columns : this.columnsToDisplaying
		}
	},
	watch: {
		columnForSorting(columnNew, columnOld){
			this.changeColumnsOrder(columnNew)
		},
		selected(newValue){
			return newValue.length ? this.$emit('amountSelectedRows', newValue.length) : this.$emit('amountSelectedRows', null)
		}
	},
	methods: {
		getProducts(){
			fetch("products.json")
			.then(response => response.json())
			.then(data => this.$store.commit('addProducts', data))
		},
		orderBy(){
			this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
		},
		changeColumnsOrder(columnNew){
			const indexElToStart = this.displayColumnsFrom.findIndex(x => x.value === columnNew)
			const elToStart =  this.displayColumnsFrom.splice(indexElToStart, 1)
			this.displayColumnsFrom.unshift(elToStart[0])
		},
		sendSelectedRowsInStore(){
			this.$store.commit('deleteProducts', this.selected)
			this.selected = []
			this.selectedAllRows = false
		},
		selectAllRows(){
			this.selected = []
			if (!this.selectedAllRows) {
				let ids = []
				this.listOfProducts.forEach(product => ids.push(product.id))
				this.selected = [...ids]
			}
		}
	},
	created(){
		try {
			this.getProducts()
		} 
		catch(e) {
			console.log('e', e)
		}
	},

}	
</script>
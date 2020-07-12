<template>
  <div id="app">
    <div class="container">
      <h1>Table UI</h1>
      <hr>
      <Controls 
      @intervalToDisplay="payload => {return fromTo = payload}"
      @sortBy="column => {return columnForSorting = column}"
      @sendSelectedColumns="selectedColumns => {return columnsToDisplaying = selectedColumns}"
      :rowsToDelete="rowsToDelete"
      @sendConfirmToDel="() => {return delRows()}"
      />
      <Table :interval="fromTo"
      :columnForSorting="columnForSorting"
      :columnsToDisplaying="columnsToDisplaying"
      @amountSelectedRows="amountRows => {return rowsToDelete = amountRows}"
      ref="tableRef"
      />
    </div>
  </div>
</template>
<script>
import Table from './components/Table'
import Controls from './components/Controls'
export default {
  name: 'App',
  data(){
    return {
      fromTo: null,
      columnForSorting: null,
      columnsToDisplaying: null,
      rowsToDelete: null
    }
  },
  methods: {
    delRows(){
      this.$refs.tableRef.sendSelectedRowsInStore()
      this.rowsToDelete = null
    }
  },
  components: {
    Table, Controls
  }
}
</script>

<style lang="sass">
@import '/sass/styles.sass'


</style>

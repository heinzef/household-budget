<template>
  <Dialog :header="header" v-model:visible="dialogStore.isPieChartDialogOpen" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}"
    :modal="true" :draggable="false">
    <Chart type="doughnut" :data="chartData" style="width: 100%; display: flex; justify-content: center;"></Chart>
  </Dialog>
</template>

<script setup>
// :options="{ indexAxis: 'y'}"
import { computed, ref } from 'vue';

import { useIncomeStore } from '@/stores/incomes';
import { useCostsStore } from '@/stores/costs';
import { useSinkingFundsStore } from '@/stores/sinkingfunds';
import { useMonthStore } from '@/stores/months';
import { useDialogStore } from '@/stores/dialogs';

const incomeStore = useIncomeStore();
const costsStore = useCostsStore();
const monthStore = useMonthStore();
const dialogStore = useDialogStore();
const sinkingFundsStore = useSinkingFundsStore();

const relatedCategory = computed(() => dialogStore.pieChartRelatedCategory);

const header = computed(() => {
  if (relatedCategory.value === 'incomes') return 'Einnahmen';
  if (relatedCategory.value === 'costs') return 'Kosten';
  if (relatedCategory.value === 'sinkingfunddeposit') return 'Spartopf Einzahlungen';
  if (relatedCategory.value === 'sinkingfundwithdraw') return 'Spartopf Ausgaben';
  return '';
});

const selectedMonth = computed(() => monthStore.selectedMonth);

const chartData = computed(() => {
  let chartDataArray = [];
  if (relatedCategory.value === 'incomes') chartDataArray = incomeStore.getIncomesForMonth(selectedMonth.value.id);
  if (relatedCategory.value === 'costs') chartDataArray = costsStore.getCostsForMonthGrouped(selectedMonth.value.id);
  if (relatedCategory.value === 'sinkingfunddeposit') chartDataArray = sinkingFundsStore.getPositiveSinkingFundPaymentsForMonth(selectedMonth.value.id);
  if (relatedCategory.value === 'sinkingfundwithdraw') chartDataArray = sinkingFundsStore.getNegativeSinkingFundPaymentsForMonth(selectedMonth.value.id);
  chartDataArray = chartDataArray.sort((a, b) => a.value - b.value).reverse();
  const chartObj = {
      labels: chartDataArray.map((i) => i.name),
      datasets: [
          {
            label: 'Betrag (€)', // header.value,
            data: chartDataArray.map((i) => i.value),
          }
      ],
  }
  return chartObj;
});
</script>

<style></style>
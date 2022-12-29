<template>
  <Dialog :header="header" v-model:visible="dialogStore.isPieChartDialogOpen" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}"
    :modal="true" :draggable="false">
    <Chart type="doughnut" :data="chartData" :options="chartOptions" style="width: 100%; display: flex; justify-content: center;"></Chart>
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

import formatter from '@/helpers/formatter';

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
  chartDataArray = chartDataArray.sort((a, b) => Math.abs(a.value) - Math.abs(b.value)).reverse();
  const chartObj = {
      labels: chartDataArray.map((i) => i.name),
      datasets: [
          {
            data: chartDataArray.map((i) => Math.abs(i.value)),
            tooltip: {
              callbacks: {
                label: (context) => {
                  return '';
                }
              }
          }
          }
      ],
  }
  return chartObj;
});

const chartOptions = ref({
  plugins: {
    tooltip: {
      callbacks: {
        footer: (context) => {
          const value = context[0].parsed;
          const sum = context[0].dataset.data.reduce((acc, curr) => acc + curr, 0);
          return [`Betrag: ${formatter.format(value)}`, `Anteil: ${(value * 100 / sum).toFixed(2)}%`];
        }
      }
    }
  }
});
</script>

<style></style>
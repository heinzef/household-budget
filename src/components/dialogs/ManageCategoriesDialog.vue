<template>
<Dialog :header="headerLabel" v-model:visible="dialogStore.isManageCategoriesDialogOpen"
  :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '75vw'}" :modal="true" :draggable="false">
  <div>
    <Button v-if="addButtonLabel.length > 0" :label="addButtonLabel" @click="dialogStore.openNewCategoryDialog(forCategoryType)"></Button>
    <DataTable :value="entries" responsiveLayout="scroll" :showGridlines="true" removableSort>
      <Column v-if="forCategoryType === 'sinkingfunds' || forCategoryType === 'varcostpayments'" field="createdAt" header="Datum" :sortable="true" style="width: 200px">
        <template #body="{data}">
          {{ dateformat(data.createdAt, 'dd.mm.yyyy') }}
        </template>
      </Column>
      <Column v-if="forCategoryType !== 'varcostpayments' && forCategoryType !== 'sinkingfunds'" field="name" header="Name" style="min-width: 60%" :sortable="true"></Column>
      <Column v-else field="comment" header="Kommentar" style="min-width: 60%" :sortable="true"></Column>
      <Column v-if="forCategoryType === 'varcostpayments' || forCategoryType === 'sinkingfunds'" field="value" header="Betrag" :sortable="true">
        <template #body="{data}">
          {{ formatter.format(data.value) }}
        </template>
      </Column>
      <Column v-if="forCategoryType === 'costs'" field="isFixCost" header="Kostentyp" :sortable="true">
        <template #body="{data}">
          {{ data.isFixCost ? 'Fixkosten' : 'Variable Kosten' }}
        </template>
      </Column>
      <Column v-if="forCategoryType !== 'sinkingfunds'" style="width: 2rem" class="non-print-column">
        <template #body="{data}">
          <span class="action-icon" title="Editieren" @click="() => onEditClicked(data)"><i class="pi pi-pencil" /></span>
        </template>
      </Column>
      <Column v-if="forCategoryType !== 'sinkingfunds'" style="width: 2rem" class="non-print-column">
        <template #body="{data}">
          <span class="action-icon" title="Löschen" @click="() => onDeleteClicked(data)"><i class="pi pi-trash" /></span>
        </template>
      </Column>
    </DataTable>
  </div>
</Dialog>
</template>

<script setup>
import { computed } from 'vue';
import dateformat from 'dateformat';

import formatter from '@/helpers/formatter';

import { useDialogStore } from '@/stores/dialogs';
import { useIncomeStore } from '@/stores/incomes';
import { useCostsStore } from '@/stores/costs';
import { useMonthStore } from '@/stores/months';
import { useSinkingFundsStore } from '@/stores/sinkingfunds';


const dialogStore = useDialogStore();
const incomeStore = useIncomeStore();
const costsStore = useCostsStore();
const monthsStore = useMonthStore();
const sinkingFundsStore = useSinkingFundsStore();

const forCategoryType = computed(() => dialogStore.manageCategoriesDialogCategoryType);
const parentItem = computed(() => dialogStore.manageCategoriesDialogParentItem);

const entries = computed(() => {
  if (forCategoryType.value === 'incomes') return incomeStore.getIncomeCategories;
  if (forCategoryType.value === 'costs') return costsStore.getAllCostCategories;
  if (forCategoryType.value === 'varcostpayments') return costsStore.getCostPaymentsForRelatedCost(parentItem.value);
  if (forCategoryType.value === 'costgroups') return costsStore.getCategoryGroups;
  if (forCategoryType.value === 'months') return monthsStore.getMonthsForDropdown;
  if (forCategoryType.value === 'sinkingfunds') return sinkingFundsStore.getPaymentsOfSinkingFund(parentItem.value);
  return [];
});

const headerLabel = computed(() => {
  if (forCategoryType.value === 'incomes') return 'Einnahmekategorien verwalten';
  if (forCategoryType.value === 'costs') return 'Kostenkategorien verwalten';
  if (forCategoryType.value === 'varcostpayments') return 'Eingetragene Kosten ansehen';
  if (forCategoryType.value === 'costgroups') return 'Kostengruppen verwalten';
  if (forCategoryType.value === 'months') return 'Monate verwalten';
  if (forCategoryType.value === 'sinkingfunds') return `Ein- und Auszahlungen für Spartopf: ${entries.value[0]?.name || ''}`;
  return '';
});

const addButtonLabel = computed(() => {
  if (forCategoryType.value === 'incomes' || forCategoryType.value === 'costs') return 'Neue Kategorie anlegen';
  if (forCategoryType.value === 'costgroups') return 'Neue Gruppe anlegen';
  if (forCategoryType.value === 'months') return 'Neuen Monat anlegen';
  return '';
});

const hintMessage = computed(() => {
  if (forCategoryType.value === 'incomes') return 'Alle dazugehörigen Einnahmen werden dabei ebenfalls gelöscht';
  if (forCategoryType.value === 'costs') return 'Alle dazugehörigen Kosten werden dabei ebenfalls gelöscht';
  if (forCategoryType.value === 'costgroups') return 'Alle dazugehörigen Kostenkategorien und Kosten werden dabei ebenfalls gelöscht';
  if (forCategoryType.value === 'months') return 'Alle dazugehörigen Einnahmen, Kosten, Spartopfeinzahlungen und Spartopfausgaben werden dabei ebenfalls gelöscht';
  return '';
});

const onEditClicked = (data) => {
  if (forCategoryType.value === 'varcostpayments') {
    dialogStore.openNewCostPaymentDialog(null, null, data)
  } else {
    dialogStore.openNewCategoryDialog(forCategoryType.value, data);
  }
};

const onDeleteClicked = (data) => {
  let deleteCallback = () => {};
  if (forCategoryType.value === 'incomes') deleteCallback = () => incomeStore.removeIncomeCategoryById(data.id);
  if (forCategoryType.value === 'costs') deleteCallback = () => costsStore.removeCostCategoryById(data.id);
  if (forCategoryType.value === 'varcostpayments') deleteCallback = () => costsStore.removeCostPaymentById(data.id);
  if (forCategoryType.value === 'costgroups') deleteCallback = () => costsStore.removeCostCategoryGroupById(data.id);
  if (forCategoryType.value === 'months') deleteCallback = () => monthsStore.removeMonthById(data.id);
  dialogStore.openConfirmDeleteDialog(() => deleteCallback(), hintMessage.value);
};
</script>

<style scoped lang="scss"></style>
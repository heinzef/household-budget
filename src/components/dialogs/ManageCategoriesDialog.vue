<template>
<Dialog :header="headerLabel" v-model:visible="dialogStore.isManageCategoriesDialogOpen"
  :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '75vw'}" :modal="true" :draggable="false">
  <div>
    <Button :label="addButtonLabel" @click="dialogStore.openNewCategoryDialog(forCategoryType)"></Button>
    <DataTable :value="entries" responsiveLayout="scroll" :showGridlines="true">
      <Column field="name" header="Name" style="min-width: 60%"></Column>
      <Column v-if="forCategoryType === 'costs'" field="isFixCost" header="Kostentyp">
        <template #body="{data}">
          {{ data.isFixCost ? 'Fixkosten' : 'Variable Kosten' }}
        </template>
      </Column>
      <Column style="width: 2rem" class="non-print-column">
        <template #body="{data}">
          <span class="action-icon" title="Editieren" @click="() => onEditClicked(data)"><i class="pi pi-pencil" /></span>
        </template>
      </Column>
      <Column style="width: 2rem" class="non-print-column">
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

import { useDialogStore } from '@/stores/dialogs';
import { useIncomeStore } from '@/stores/incomes';
import { useCostsStore } from '@/stores/costs';
import { useMonthStore } from '@/stores/months';


const dialogStore = useDialogStore();
const incomeStore = useIncomeStore();
const costsStore = useCostsStore();
const monthsStore = useMonthStore();

const forCategoryType = computed(() => dialogStore.manageCategoriesDialogCategoryType);

const entries = computed(() => {
  if (forCategoryType.value === 'incomes') return incomeStore.getIncomeCategories;
  if (forCategoryType.value === 'costs') return costsStore.getAllCostCategories;
  if (forCategoryType.value === 'costgroups') return costsStore.getCategoryGroups;
  if (forCategoryType.value === 'months') return monthsStore.getMonthsForDropdown;
  return [];
});

const headerLabel = computed(() => {
  if (forCategoryType.value === 'incomes') return 'Einnahmekategorien verwalten';
  if (forCategoryType.value === 'costs') return 'Kostenkategorien verwalten';
  if (forCategoryType.value === 'costgroups') return 'Kostengruppen verwalten';
  if (forCategoryType.value === 'months') return 'Monate verwalten';
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
  dialogStore.openNewCategoryDialog(forCategoryType.value, data);
};

const onDeleteClicked = (data) => {
  let deleteCallback = () => {};
  if (forCategoryType.value === 'incomes') deleteCallback = () => incomeStore.removeIncomeCategoryById(data.id);
  if (forCategoryType.value === 'costs') deleteCallback = () => costsStore.removeCostCategoryById(data.id);
  if (forCategoryType.value === 'costgroups') deleteCallback = () => costsStore.removeCostCategoryGroupById(data.id);
  if (forCategoryType.value === 'months') deleteCallback = () => monthsStore.removeMonthById(data.id);
  dialogStore.openConfirmDeleteDialog(() => deleteCallback(), hintMessage.value);
};
</script>

<style scoped lang="scss"></style>
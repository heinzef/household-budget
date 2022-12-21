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
        <template #body>
          <span class="action-icon" title="Editieren"><i class="pi pi-pencil" /></span>
        </template>
      </Column>
      <Column style="width: 2rem" class="non-print-column">
        <template #body="{data}">
          <span class="action-icon" title="Löschen" @click="dialogStore.openConfirmDeleteDialog(() => incomeStore.removeIncomeCategoryById(data.id))"><i class="pi pi-trash" /></span>
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
});

const addButtonLabel = computed(() => {
  if (forCategoryType.value === 'incomes' || forCategoryType.value === 'costs') return 'Neue Kategorie anlegen';
  if (forCategoryType.value === 'costgroups') return 'Neue Gruppe anlegen';
  if (forCategoryType.value === 'months') return 'Neuen Monat anlegen';
});
</script>

<style scoped lang="scss"></style>
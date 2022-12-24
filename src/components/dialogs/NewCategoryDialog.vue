<template>
  <Dialog :header="headerText" v-model:visible="dialogStore.isNewCategoryDialogOpen" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false"
    @hide="onHide">
    <div>
      <div><label>Name:</label></div>
      <div class="p-inputgroup">
        <InputText v-model="dialogStore.newCategoryInputText" @keyup.enter="saveNewCategory"/>
      </div>
      <div v-if="categoryForType === 'costs'">
        <div><label>Kostengruppe:</label></div>
        <div class="p-inputgroup">
          <Dropdown :filter="true" v-model="selectedCostGroup" :showClear="true"
              placeholder="Wähle eine Kostengruppe" :options="costGroups" optionLabel="name" />
        </div>
      </div>
      <div v-if="categoryForType === 'costs'">
        <label>Fixkosten:</label>
        <Checkbox v-model="isFixCost" :binary="true" />
      </div>
      <div v-if="categoryForType === 'sinkingfunds'">
        <div><label>Guthaben:</label></div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="pi pi-euro"></i>
          </span>
          <InputNumber v-model="moneyInDaBank" @keyup.enter="saveNewCategory"
            mode="decimal" locale="de-DE" :minFractionDigits="2"/>
        </div>
      </div>
    </div>
    <template #footer>
        <Button label="Abbrechen" @click="dialogStore.hideNewCategoryDialog()" class="p-button-text"/>
        <Button label="Speichern" @click="saveNewCategory"/>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useDialogStore } from '@/stores/dialogs';
import { useIncomeStore } from '@/stores/incomes';
import { useCostsStore } from '@/stores/costs';
import { useSinkingFundsStore } from '@/stores/sinkingfunds';
import { useMonthStore } from '@/stores/months';

const dialogStore = useDialogStore();
const incomeStore = useIncomeStore();
const costsStore = useCostsStore();
const sinkingFundsStore = useSinkingFundsStore();
const monthStore = useMonthStore();

const isInEditMode = computed(() => dialogStore.newCategoryDialogEditMode);
const editItem = computed(() => dialogStore.newCategoryDialogEditItem);

const isFixCost = computed({
  get: () => dialogStore.newCategoryDialogRelatedBoolValue,
  set: (value) => dialogStore.setNewCategoryDialogRelatedBoolValue(value),
});

const moneyInDaBank = computed({
  get: () => dialogStore.newCategoryDialogRelatedNumberValue,
  set: (value) => dialogStore.setNewCategoryDialogRelatedNumberValue(value),
});

const categoryForType = computed(() => dialogStore.newCategoryFor);

const saveNewCategory = () => {
  if (categoryForType.value === 'incomes') {
    if (isInEditMode.value) {
      incomeStore.editIncomeCategory(editItem.value, dialogStore.newCategoryInputText);
    } else {
      incomeStore.addIncomeCategory(dialogStore.newCategoryInputText);
    }
  } else if (categoryForType.value === 'costs') {
    if (isInEditMode.value) {
      costsStore.editCostCategory(editItem.value, dialogStore.newCategoryInputText, isFixCost.value, selectedCostGroup.value.id);
    } else {
      costsStore.addCostCategory(dialogStore.newCategoryInputText, isFixCost.value, selectedCostGroup.value.id);
    }
  } else if (categoryForType.value === 'costgroups') {
    if (isInEditMode.value) {
      costsStore.editCostCategoryGroup(editItem.value, dialogStore.newCategoryInputText);
    } else {
      costsStore.addCostCategoryGroup(dialogStore.newCategoryInputText);
    }
  } else if(categoryForType.value === 'sinkingfunds') {
    if (isInEditMode.value) {
      sinkingFundsStore.editSinkingFund(editItem.value, dialogStore.newCategoryInputText, moneyInDaBank.value);
    } else {
      sinkingFundsStore.addSinkingFund(dialogStore.newCategoryInputText, moneyInDaBank.value);
    }
  } else if(categoryForType.value === 'months') {
    if (isInEditMode.value) {
      monthStore.editMonth(editItem.value, dialogStore.newCategoryInputText);
    } else {
      monthStore.addMonth(dialogStore.newCategoryInputText);
    }
  }
  dialogStore.hideNewCategoryDialog();
};

const headerText = computed(() => {
  if (categoryForType.value === 'incomes') {
    if (isInEditMode.value) return 'Einnahmenskategorie bearbeiten';
    return 'Neue Einnahmenskategorie anlegen';
  }
  if (categoryForType.value === 'costs') return 'Neue Kostenkategorie anlegen';
  if (categoryForType.value === 'costgroups') {
    if (isInEditMode.value) return 'Kostengruppe bearbeiten';
    return 'Neue Kostengruppe anlegen';
  }
  if (categoryForType.value === 'sinkingfunds') {
    if (isInEditMode.value) return 'Spartopf bearbeiten';
    return 'Neuen Spartopf anlegen';
  }
  if (categoryForType.value === 'months') {
    if (isInEditMode.value) return 'Monat bearbeiten';
    return 'Neuen Monat anlegen';
  }
  return 'Neue Kategorie anlegen';
});

const costGroups = computed(() => costsStore.costCategoryGroups);
const selectedCostGroup = computed({
  get: () => dialogStore.newCategoryDialogParentItem,
  set: (value) => dialogStore.setNewCategoryDialogParentItem(value),
});

const onHide = () => {
  moneyInDaBank.value = 0;
};
</script>

<style scoped lang="scss"></style>
<template>
    <Dialog :header="header" v-model:visible="dialogStore.isNewMoneyEntryDialogOpen"
      :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false">
      <div>
        <div><label>Betrag:</label></div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="pi pi-euro"></i>
          </span>
          <InputNumber v-model="dialogStore.newMoneyEntryAmountInput" @input="(ev) => dialogStore.setNewMoneyEntryAmountInput(ev.value)"
            mode="decimal" locale="de-DE" :minFractionDigits="2" @keyup.enter="saveNewMoneyEntry"/>
        </div>
        <div><label>{{ relatedItemText }}:</label></div>
        <div class="p-inputgroup">
          <Dropdown class="month-select" :filter="true" v-model="dialogStore.newMoneyEntryRelatedItem" :showClear="true"
              :placeholder="relatedItemPlaceholder" :options="relatedItemOptions" optionLabel="name" />
        </div>
        <div><label>Dazugehöriger Monat</label></div>
        <div class="p-inputgroup">
          <Dropdown class="month-select" :filter="true" v-model="dialogStore.newMoneyEntryRelatedMonth" :showClear="true"
              placeholder="Wähle einen Monat" :options="monthStore.getMonthsForDropdown" optionLabel="name" />
        </div>
        <div v-if="entryType === 'sinkingfundwithdraw'">
          <div><label>Kommentar:</label></div>
          <div class="p-inputgroup">
            <InputText v-model="dialogStore.newMoneyEntryCommentInput" @keyup.enter="saveNewMoneyEntry"/>
          </div>
        </div>
      </div>
      <template #footer>
          <Button label="Abbrechen" @click="dialogStore.hideNewMoneyEntryDialog()" class="p-button-text"/>
          <Button label="Speichern" @click="saveNewMoneyEntry" autofocus />
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

const entryType = computed(() => dialogStore.newMoneyEntryType);
const isInEditMode = computed(() => dialogStore.newMoneyEntryDialogIsInEditMode);
const editItem = computed(() => dialogStore.newMoneyEntryEditItem);


const saveNewMoneyEntry = () => {
  if (entryType.value === 'income') {
    incomeStore.saveNewIncome(dialogStore.newMoneyEntryRelatedItem.name, dialogStore.newMoneyEntryAmountInput,
      dialogStore.newMoneyEntryRelatedItem.id, dialogStore.newMoneyEntryRelatedMonth.id, editItem.value)
  } else if (entryType.value === 'fixcost') {
    costsStore.addCost(dialogStore.newMoneyEntryRelatedItem.name, dialogStore.newMoneyEntryAmountInput,
      true, dialogStore.newMoneyEntryRelatedItem.id, dialogStore.newMoneyEntryRelatedMonth.id, editItem.value);
  } else if (entryType.value === 'varcost') {
    costsStore.addCost(dialogStore.newMoneyEntryRelatedItem.name, dialogStore.newMoneyEntryAmountInput,
      false, dialogStore.newMoneyEntryRelatedItem.id, dialogStore.newMoneyEntryRelatedMonth.id, editItem.value);
  } else if (entryType.value === 'sinkingfunddeposit') {
    sinkingFundsStore.addSinkingFundPayment(dialogStore.newMoneyEntryRelatedItem.name, dialogStore.newMoneyEntryAmountInput,
      dialogStore.newMoneyEntryRelatedItem.id, dialogStore.newMoneyEntryRelatedMonth.id, '', editItem.value);
  } else if (entryType.value === 'sinkingfundwithdraw') {
    sinkingFundsStore.addSinkingFundPayment(dialogStore.newMoneyEntryRelatedItem.name, dialogStore.newMoneyEntryAmountInput * -1,
      dialogStore.newMoneyEntryRelatedItem.id, dialogStore.newMoneyEntryRelatedMonth.id, dialogStore.newMoneyEntryCommentInput, editItem.value);
  }
  dialogStore.hideNewMoneyEntryDialog();
};



const header = computed(() => {
  const actionText = isInEditMode.value ? 'bearbeiten' : 'hinzufügen';
  if (entryType.value === 'income') return `Einnahme ${actionText}`;
  if (entryType.value === 'fixcost') return `Fixkosten ${actionText}`;
  if (entryType.value === 'varcost') return `Variable Kosten ${actionText}`
  if (entryType.value === 'sinkingfunddeposit') return `Spartopf Einzahlung ${actionText}`;
  if (entryType.value === 'sinkingfundwithdraw') return `Spartopf Ausgabe ${actionText}`;
  return `Neuen Geldeintrag ${actionText}`;
});

const relatedItemText = computed(() => {
  if (entryType.value === 'sinkingfunddeposit' || entryType.value === 'sinkingfundwithdraw') {
    return 'Dazugehöriger Spartopf';
  }
  return 'Dazugehörige Kategorie';
});

const relatedItemPlaceholder = computed(() => {
  if (entryType.value === 'sinkingfunddeposit' || entryType.value === 'sinkingfundwithdraw') {
    return 'Wähle einen Spartopf';
  }
  return 'Wähle eine Kategorie';
});

const relatedItemOptions = computed(() => {
  if (entryType.value === 'income') return incomeStore.getIncomeCategories;
  if (entryType.value === 'fixcost') return costsStore.getFixCostCategories;
  if (entryType.value === 'varcost') return costsStore.getVarCostCategories;
  if (entryType.value === 'sinkingfunddeposit') return sinkingFundsStore.getSinkingFunds;
  if (entryType.value === 'sinkingfundwithdraw') return sinkingFundsStore.getSinkingFunds;
  return [];
});
</script>

<style scoped lang="scss"></style>
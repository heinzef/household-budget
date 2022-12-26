<template>
  <Dialog :header="header" v-model:visible="dialogStore.isNewCostPaymentDialogOpen"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false">
    <div>
      <div><label>Betrag:</label></div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
            <i class="pi pi-euro"></i>
        </span>
        <InputNumber v-model="dialogStore.newCostPaymentAmount" @keyup.enter="saveNewCostPayment"
          mode="decimal" locale="de-DE" :minFractionDigits="2"/>
      </div>
      <div><label>Kommentar:</label></div>
      <div class="p-inputgroup">
          <InputText v-model="dialogStore.newCostPaymentComment" @keyup.enter="saveNewCostPayment"/>
      </div>
    </div>
    <template #footer>
      <Button label="Abbrechen" @click="dialogStore.hideNewCostPaymentDialog()" class="p-button-text"/>
      <Button label="Speichern" @click="saveNewCostPayment" />
    </template>
  </Dialog>
</template>
    
<script setup>
import { computed } from 'vue';

import { useDialogStore } from '@/stores/dialogs';
import { useCostsStore } from '@/stores/costs';

const dialogStore = useDialogStore();
const costsStore = useCostsStore();

const relatedCostName = computed(() => dialogStore.newCostPaymentRelatedCostName);
const relatedCostId = computed(() => dialogStore.newCostPaymentRelatedCostId);

const isInEditMode = computed(() => dialogStore.newCostPaymentIsInEditMode);
const editItemId = computed(() => dialogStore.newCostPaymentEditItemId);

const header = computed(() => {
  if (isInEditMode.value) return 'Kosteneintrag bearbeiten';
  return `Neuer Kosteneintrag für ${relatedCostName.value}`;
});


const saveNewCostPayment = () => {
  if (isInEditMode.value) {
    costsStore.editCostPayment(editItemId.value, dialogStore.newCostPaymentAmount, dialogStore.newCostPaymentComment);
  } else {
    costsStore.addCostPayment(relatedCostId.value, dialogStore.newCostPaymentAmount, dialogStore.newCostPaymentComment);
  }
  dialogStore.hideNewCostPaymentDialog();
};

</script>

<style scoped lang="scss"></style>
<template>
<div>
  <div class="table-headline">
    <div>{{ props.header }}</div>
    <div>Gesamt: {{ formatter.format(props.invert && props.balance < 0 ? props.balance * -1 : props.balance) }}</div>
  </div>
  <DataTable :value="props.entries" responsiveLayout="scroll" :showGridlines="true">
    <Column field="name" header="Name" style="width: 60%"></Column>
    <Column v-if="props.showComments" field="comment" header="Kommentar"></Column>
    <Column header="Wert">
      <template #body="{ data }">
        {{ formatter.format(props.invert ? data.value * -1 : data.value) }}
      </template>
    </Column>
    <Column header="Ausgegeben"  v-if="props.showPay">
      <template #body="{ data }">
        <span v-if="data.paid !== undefined">{{ formatter.format(data.paid) }}</span>
      </template>
    </Column>
    <Column style="width: 2rem" v-if="props.payable" class="non-print-column">
      <template #body="{ data }">
        <span class="action-icon" title="Ansehen" @click="dialogStore.openManageCategoriesDialog('varcostpayments', data.id)"><i class="pi pi-list" /></span>
      </template>
    </Column>
    <Column style="width: 2rem" v-if="props.payable" class="non-print-column">
      <template #body="{ data }">
        <span class="action-icon" title="Eintragen" @click="dialogStore.openNewCostPaymentDialog(data.name, data.id)"><i class="pi pi-credit-card" /></span>
      </template>
    </Column>
    <Column style="width: 2rem" class="non-print-column">
      <template #body="{ data }">
        <span class="action-icon" title="Editieren" @click="props.onEditClicked(data)"><i class="pi pi-pencil" /></span>
      </template>
    </Column>
    <Column style="width: 2rem" class="non-print-column">
      <template #body="{ data }">
        <span class="action-icon" title="Löschen" @click="dialogStore.openConfirmDeleteDialog(() => props.onDeleteClicked(data.id))"><i class="pi pi-trash" /></span>
      </template>
    </Column>
  </DataTable>
</div>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialogs';
import formatter from '@/helpers/formatter';

const dialogStore = useDialogStore();

const props = defineProps({
  entries: Array,
  balance: {
    type: Number,
    default: 0,
  },
  header: String,
  showComments: {
    type: Boolean,
    default: false,
  },
  showPay: Boolean,
  payable: Boolean,
  onEditClicked: Function,
  onDeleteClicked: Function,
  invert: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.table-headline {
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
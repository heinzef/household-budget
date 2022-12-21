<template>
  <div class="links-box">
    <div class="left">
      <div v-if="props.showAddIncome" class="link" @click="openNewMoneyEntryClicked('income')">Einnahme hinzufügen</div>
      <div v-if="props.showAddFixCost" class="link" @click="openNewMoneyEntryClicked('fixcost')">Fixkosten hinzufügen</div>
      <div v-if="props.showAddVarCost" class="link" @click="openNewMoneyEntryClicked('varcost')">Variable Kosten hinzufügen</div>
      <div v-if="props.showDepositSinkingFund" class="link" @click="openNewMoneyEntryClicked('sinkingfunddeposit')">In Spartopf einzahlen</div>
      <div v-if="props.showWithdrawSinkingFund" class="link" @click="openNewMoneyEntryClicked('sinkingfundwithdraw')">Spartopf Ausgabe hinzufügen</div>
    </div>
    <div class="right">
      <div v-if="props.showNewSinkingFund" class="link" @click="dialogStore.openNewCategoryDialog('sinkingfunds')">Neuen Spartopf anlegen</div>
    </div>
  </div>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialogs';

const dialogStore = useDialogStore();

const props = defineProps({
  showAddIncome: {
    type: Boolean,
    default: true,
  },
  showAddFixCost: {
    type: Boolean,
    default: true,
  },
  showAddVarCost: {
    type: Boolean,
    default: true,
  },
  showDepositSinkingFund: {
    type: Boolean,
    default: true,
  },
  showWithdrawSinkingFund: {
    type: Boolean,
    default: true,
  },
  showNewSinkingFund: {
    type: Boolean,
    default: false,
  },
  selectedMonth: Object,
})

const openNewMoneyEntryClicked = (forType) => {
  if (props.selectedMonth) {
    dialogStore.setNewMoneyEntryRelatedMonth(props.selectedMonth);
  } else {
    dialogStore.setNewMoneyEntryRelatedMonth(null);
  }
  dialogStore.openNewMoneyEntryDialog(forType);
}
</script>

<style scoped lang="scss">
.links-box {
  display: flex;
  padding-top: 1rem;
  justify-content: space-between;
}

.left, .right {
  display: flex;
}

.link {
  color: #314854;
  text-decoration: underline;
  cursor: pointer;
  padding: .75rem 0rem;
  margin: 0 .75rem;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    text-decoration: none;
  }
}
</style>
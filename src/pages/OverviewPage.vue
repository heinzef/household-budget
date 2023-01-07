<template>
  <div v-if="navigationStore.getActivePage === 'overview'">
    <DashboardHeader>
      <template #pageName>
        <span>Guten {{greeting}}</span>
        <span v-if="profileStore.hasUserName">, {{ profileStore.getUserName }}</span>
        <span>!</span>      
      </template>
      <template #rightContent>
        <div class="overview-header-panel">
          <Dropdown class="month-select" :filter="true" v-model="selectedMonth"
            placeholder="Wähle einen Monat" :options="monthStore.getMonthsForDropdown" optionLabel="name" />
          <div class="download-month-button" title="Monat als Excel-Datei exportieren"
            @click="exportSelectedMonthToExcel()"><i class="pi pi-download" /></div>
        </div>
      </template>
    </DashboardHeader>
    <div class="dashboard-content">
      <div class="month-view" v-if="selectedMonth">
        <div class="month-view-header-section">
          <div class="month-view-header">
            <div class="month-name">{{ selectedMonth.name }}</div>
            <div class="month-balance">Saldo: {{formatter.format(balanceOfMonth)}}</div>
          </div>
          <LinkBox :selectedMonth="selectedMonth"/>
        </div>
        <div class="box-wrapper">
          <div class="box" @click="dialogStore.openPieChartDialog('incomes')">
            <div>
              <div class="box-header">Einnahmen</div>
              <div class="box-content">{{ formatter.format(incomesOfMonth) }}</div>
            </div>
          </div>
          <div class="box" @click="dialogStore.openPieChartDialog('costs')">
            <div>
              <div class="box-header">Kosten</div>
              <div class="box-content">{{ formatter.format(costsOfMonth) }}</div>
            </div>
          </div>
          <div class="box" @click="dialogStore.openPieChartDialog('sinkingfunddeposit')">
            <div>
              <div class="box-header">Spartopf Einzahlungen</div>
              <div class="box-content">{{ formatter.format(sinkingFundsDepositsOfMonth) }}</div>
            </div>
          </div>
          <div class="box" @click="dialogStore.openPieChartDialog('sinkingfundwithdraw')">
            <div>
              <div class="box-header">Spartopf Ausgaben</div>
              <div class="box-content">{{ formatter.format(sinkingFundsWithdrawsOfMonth * ( sinkingFundsWithdrawsOfMonth < 0 ? -1 : 1)) }}</div>
            </div>
          </div>
        </div>
        <div class="table-section">
          <MoneyTable :entries="incomeStore.getIncomesForMonth(selectedMonth.id)" header="Einnahmen"
            :balance="incomesOfMonth"
            :onEditClicked="(item) => dialogStore.openNewMoneyEntryDialog('income', true, item)"
            :onDeleteClicked="(id) => incomeStore.removeIncomeById(id)"/>
          <MoneyTable :entries="costsStore.getFixCostsForMonth(selectedMonth.id)" header="Fixkosten"
            :balance="costsStore.getFixCostsForMonthReduced(selectedMonth.id)"
            :onEditClicked="(item) => dialogStore.openNewMoneyEntryDialog('fixcost', true, item)"
            :onDeleteClicked="(id) => costsStore.removeCostById(id)"/>
          <MoneyTable :entries="costsStore.getVarCostsForMonth(selectedMonth.id)" header="Variable Kosten"
            :balance="costsStore.getVarCostsForMonthReduced(selectedMonth.id, false)"
            :additionalBalanceText="` (Offen: ${formatter.format(costsStore.getVarCostsForMonthReduced(selectedMonth.id, false) - costsStore.getVarCostsForMonthReduced(selectedMonth.id, true))})`"
            :showPay="true" :payable="true"
            :onEditClicked="(item) => dialogStore.openNewMoneyEntryDialog('varcost', true, item)"
            :onDeleteClicked="(id) => costsStore.removeCostById(id)"/>
          <MoneyTable :entries="sinkingFundsStore.getPositiveSinkingFundPaymentsForMonth(selectedMonth.id)" header="Spartopf Einzahlungen"
            :balance="sinkingFundsDepositsOfMonth"
            :onEditClicked="(item) => dialogStore.openNewMoneyEntryDialog('sinkingfunddeposit', true, item)"
            :onDeleteClicked="(id) => sinkingFundsStore.removeSinkingFundPaymentById(id)" />
          <MoneyTable :entries="sinkingFundsStore.getNegativeSinkingFundPaymentsForMonth(selectedMonth.id)" header="Spartopf Ausgaben" :invert="true"
            :balance="sinkingFundsWithdrawsOfMonth"
            :showComments="true"
            :onEditClicked="(item) => dialogStore.openNewMoneyEntryDialog('sinkingfundwithdraw', true, item)"
            :onDeleteClicked="(id) => sinkingFundsStore.removeSinkingFundPaymentById(id)" />
          
        </div>
      </div>
      <ScrollTop target="parent" :threshold="100" />
    </div>
  </div>
</template>
  
<script setup>
import { computed, ref } from 'vue';

import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import MoneyTable from '@/components/dashboard/MoneyTable.vue';
import LinkBox from '@/components/dashboard/LinkBox.vue';

import { useMonthStore } from '@/stores/months';
import { useIncomeStore } from '@/stores/incomes';
import { useCostsStore } from '@/stores/costs';
import { useSinkingFundsStore } from '@/stores/sinkingfunds';
import { useNavigationStore } from '@/stores/navigation';
import { useDialogStore } from '@/stores/dialogs';
import { useProfileStore } from '@/stores/profile';

import { exportSelectedMonthToExcel } from '@/services/exports.service';


import formatter from '@/helpers/formatter';


const monthStore = useMonthStore();
const selectedMonth = computed({
  get: () => monthStore.selectedMonth,
  set: (value) => monthStore.setSelectedMonth(value),
});

const incomeStore = useIncomeStore();
const incomesOfMonth = computed(() => incomeStore.getIncomesForMonthReduced(selectedMonth.value.id));

const costsStore = useCostsStore();
const costsOfMonth = computed(() => costsStore.getFixCostsForMonthReduced(selectedMonth.value.id) + costsStore.getVarCostsForMonthReduced(selectedMonth.value.id));

const sinkingFundsStore = useSinkingFundsStore();
const sinkingFundsDepositsOfMonth = computed(() => sinkingFundsStore.getPositiveSinkingFundPaymentsForMonthReduced(selectedMonth.value.id));
const sinkingFundsWithdrawsOfMonth = computed(() => sinkingFundsStore.getNegativeSinkingFundPaymentsForMonthReduced(selectedMonth.value.id));

const balanceOfMonth = computed(() => incomesOfMonth.value - costsOfMonth.value - sinkingFundsDepositsOfMonth.value);

const navigationStore = useNavigationStore();
const dialogStore = useDialogStore();
const profileStore = useProfileStore();

const now = ref(new Date());
const greeting = computed(() => {
  if (now.value.getHours() < 12) return 'Morgen';
  if (now.value.getHours() > 17) return 'Abend';
  return 'Tag';
});
</script>
  
<style scoped lang="scss">
.overview-header-panel {
  display: grid;
  grid-template-columns: 5fr 1fr;
  align-items: center;
  gap: 2rem;

  .download-month-button {
    cursor: pointer;

    &:hover {
      color: #000;
    }
    .pi {
      font-size: 1.1rem;
    }
  }

}
.month-select {
  max-width: 400px;
  border: 0;
  outline: 0;
  color: #314854;
  font-weight: bold;
  box-shadow: none;

  ::v-deep(.p-inputtext) {
    font-size: 1.2rem;
  }
}
.month-view {
  .month-view-header-section {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    padding: 0 2rem;
    padding-bottom: 1rem;
  }
  .month-view-header {
    display: flex;
    justify-content: space-between;
  }
  .month-name, .month-balance {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .box-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    margin: 1rem 0;
    padding: 0 2rem;
    margin-bottom: 2rem;
  }

  .box {
    min-width: 175px;
    height: 75px;
    box-shadow: 0px 1px 5px 0px #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: linear-gradient(180deg, #fff3b6, #e1bd3a);

    &:hover {
      box-shadow: 0px 1px 5px 0px #555;
    }

    .box-header {
      font-weight: bold;
      text-align: center;
    }

    .box-content {
      margin-top: 0.25rem;
      font-weight: bold;
      font-size: 1.5rem;
      text-align: center;
    }
  }
  .table-section {
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem 5rem;
  }
}

@media screen and (max-width: 1380px) {
  .box-wrapper {
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
  }
}

@media screen and (max-width: 730px) {
  .box-wrapper {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }
}
</style>
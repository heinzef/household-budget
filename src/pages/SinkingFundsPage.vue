<template>
    <div v-if="navigationStore.getActivePage === 'sinkingfunds'">
      <DashboardHeader class="keep-for-printing">
        <template #pageName>Spartöpfe</template>
        <template #pageDetailText>Verwalte Deine Spartöpfe und lege neue Sparziele an.</template>
        <template #rightContent>
          <div class="sf-header-panel">
            <div class="balance" :class="{ 'red': sinkingFundsStore.getSinkingFundsReduced < 0 }">
              Saldo: {{ formatter.format(sinkingFundsStore.getSinkingFundsReduced) }}
            </div>
            <div class="download-button" title="Spartöpfe als Excel-Datei exportieren"
              @click="exportSinkingFundsToExcel()"><i class="pi pi-download" /></div>
          </div>
        </template>
    </DashboardHeader>
    <div class="dashboard-content">
      <div class="sf-content-wrapper">
        <div class="sf-content-header">
          <LinkBox :showAddIncome="false" :showAddFixCost="false" :showAddVarCost="false" :showNewSinkingFund="true" />
        </div>
        <DataTable :value="sinkingFundsStore.getSinkingFundsSortable" responsiveLayout="scroll" :showGridlines="true" removableSort>
          <Column field="name" header="Name" :sortable="true" style="width: 60%"></Column>
          <Column header="Wert" field="value" :sortable="true"> 
            <template #body="{ data }">
            <span class="bold" :class="{'red': data.value < 0}">
              {{ formatter.format(data.value)}}
            </span>
            </template>
          </Column>
          <Column style="width: 2rem" class="non-print-column">
            <template #body="{ data }">
              <span class="action-icon" title="Ansehen" @click="dialogStore.openManageCategoriesDialog('sinkingfunds', data.id)"><i class="pi pi-list" /></span>
            </template>
          </Column>
          <Column style="width: 2rem" class="non-print-column">
            <template #body="{data}">
              <span class="action-icon" title="Editieren" @click="dialogStore.openNewCategoryDialog('sinkingfunds', sinkingFundsStore.getSinkingFundById(data.id))"><i class="pi pi-pencil" /></span>
            </template>
          </Column>
          <Column style="width: 2rem" class="non-print-column">
            <template #body="{data}">
              <span class="action-icon" title="Löschen"
                @click="dialogStore.openConfirmDeleteDialog(() => sinkingFundsStore.removeSinkingFundById(data.id), 'Alle dazugehörigen Einzahlungen und Ausgaben werden ebenfalls gelöscht')"><i class="pi pi-trash" /></span>
            </template>
          </Column>
        </DataTable>
      </div>
      <ScrollTop target="parent" :threshold="100"/>
    </div>
  </div>
</template>

<script setup>
import formatter from '@/helpers/formatter';

import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import LinkBox from '@/components/dashboard/LinkBox.vue';

import { useNavigationStore } from '@/stores/navigation';
import { useSinkingFundsStore } from '@/stores/sinkingfunds';
import { useDialogStore } from '@/stores/dialogs';

import { exportSinkingFundsToExcel } from '@/services/exports.service';

const navigationStore = useNavigationStore();
const dialogStore = useDialogStore();
const sinkingFundsStore = useSinkingFundsStore();
</script>

<style scoped lang="scss">
.sf-header-panel {
  display: grid;
  grid-template-columns: 5fr 1fr;
  align-items: center;
  gap: 2rem;

  .download-button {
    cursor: pointer;

    &:hover {
      color: #000;
    }
    .pi {
      font-size: 1.1rem;
    }
  }

}
.balance {
  font-size: 1.25rem;
  font-weight: bold;
  color: black;
}
.bold {
  font-weight: normal;
}

.red {
  color: red;
}

.sf-content-wrapper {
  padding: 0 2rem;

  .sf-content-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    padding-bottom: 1rem;
  }
}
</style>
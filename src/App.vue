<template>
  <div class="app-wrapper">
    <div class="left-page" :style="`background-color: ${leftBGColor};`">
      <div class="left-content">
        <NavigationSidebar />
        <Dashboard />
      </div>
    </div>
    <div class="right-page" :style="`background-color: ${rightBGColor};`">
      <div class="right-content">
        <Sidebar />
      </div>
    </div>
  </div>
  <NewCategoryDialog />
  <NewMoneyEntryDialog />
  <NewCostPaymentDialog />
  <ManageCategoriesDialog />
  <PieChartDialog />
  <ConfirmDeleteDialog />
  <UserNameDialog />
  <ImportDialog />
</template>

<script setup>
import { computed } from 'vue';

import Dashboard from "./views/Dashboard.vue";
import NavigationSidebar from './components/page/NavigationSidebar.vue';
import Sidebar from './views/Sidebar.vue';
import NewCategoryDialog from './components/dialogs/NewCategoryDialog.vue';
import NewMoneyEntryDialog from './components/dialogs/NewMoneyEntryDialog.vue';
import NewCostPaymentDialog from './components/dialogs/NewCostPaymentDialog.vue';
import ManageCategoriesDialog from './components/dialogs/ManageCategoriesDialog.vue';
import PieChartDialog from './components/dialogs/PieChartDialog.vue';
import ConfirmDeleteDialog from './components/dialogs/ConfirmDeleteDialog.vue';
import UserNameDialog from './components/dialogs/UserNameDialog.vue';
import ImportDialog from './components/dialogs/ImportDialog.vue';

import { useColorStore } from '@/stores/colors'; 



const colorStore = useColorStore();

const leftBGColor = computed(() => colorStore.leftBGColor);
const rightBGColor = computed(() => colorStore.rightBGColor);
</script>

<style lang="scss">

#app, .app-wrapper {
  min-height: 100vh;
  display: flex;
}

.left-page {
  width: 80vw;
  background: #DBE3E5;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .left-content {
    width: 95%;
    height: 80vh;
    background: white;
    display: flex;
    padding-top: 30px;
  }

}

.right-page {
  width: 20vw;
  background: #809199;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .right-content {
    background: #314854;
    width: 85%;
    height: 80vh;

    header {
      display: flex;
      justify-content: flex-start;
      margin: 1rem 1rem 0rem 1rem;
      color: white;
    }
  }
}
</style>

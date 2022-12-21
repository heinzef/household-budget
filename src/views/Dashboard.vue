<template>
  <div class="dashboard-wrapper">
    <div id="dashboard">
      <OverviewPage />
      <SinkingFundsPage />
      <ChartsPage />
      <ProfilePage />
    </div>
  </div>
</template>

<script setup>
import OverviewPage from '@/pages/OverviewPage.vue';
import ChartsPage from '@/pages/ChartsPage.vue';
import SinkingFundsPage from '@/pages/SinkingFundsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
</script>

<style scoped lang="scss">
.dashboard-wrapper {
  width: calc(100% - 100px);
  height: 100%;

  #dashboard {
    width: 100%;
    background: #fff; 
  }
}
</style>
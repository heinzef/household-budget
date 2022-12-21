<template>
    <div v-if="navigationStore.getActivePage === 'charts'">
      <DashboardHeader>
        <template #pageName>Charts</template>
        <template #pageDetailText>Schau Dir Deine Finanzen genauer an.</template>
    </DashboardHeader>
  </div>
</template>

<script setup>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';
import { useNavigationStore } from '@/stores/navigation';

const navigationStore = useNavigationStore();
</script>

<style scoped lang="scss"></style>
<template>
  <div class="dashboard-header">
    <div class="left">
      <div>
        <div class="greeting"><slot name="pageName"></slot></div>
        <div><slot name="pageDetailText">Verwalte ganz einfach Deine Finanzen.</slot></div>
      </div>              
    </div>
    <div class="right">
      <slot name="rightContent"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { useMonthStore } from '@/stores/months';

const monthStore = useMonthStore();
const selectedMonths = computed({
  get: () => monthStore.selectedMonths,
  set: (value) => monthStore.setSelectedMonths(value),
});
</script>

<style scoped lang="scss">
.dashboard-header {
  color: #809199;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  .left, .right {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .greeting {
    font-size: 2rem;
    color: #314854;
  }
}
</style>
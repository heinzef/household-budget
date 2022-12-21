<template>
  <ul>
    <li @click="dialogStore.openManageCategoriesDialog('months')">Monate verwalten</li>
    <li @click="dialogStore.openManageCategoriesDialog('incomes')">Einnahmenkategorien verwalten</li>
    <li @click="dialogStore.openManageCategoriesDialog('costgroups')">Kostengruppen verwalten</li>
    <li @click="dialogStore.openManageCategoriesDialog('costs')">Kostenkategorien verwalten</li>
  </ul>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation';
import { useDialogStore } from '@/stores/dialogs';

const navigationStore = useNavigationStore();
const dialogStore = useDialogStore();
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding-top: 20px;
  padding-right: 10px;
}

li {
  margin: 1rem 0rem;
  cursor: pointer;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;

  &:hover {
    text-decoration: underline;
  }
}

</style>
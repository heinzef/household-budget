<template>
    <div v-if="navigationStore.getActivePage === 'profile'">
      <DashboardHeader>
        <template #pageName>Mein Profil</template>
        <template #pageDetailText>Verwalte Dein Profil und den Look des Dashboards.</template>
      </DashboardHeader>
      <ColorPicker :inline="false" v-model="leftBGColor" />
      <ColorPicker :inline="false" v-model="rightBGColor" />
      <div><Button label="Speichern" @click="colorStore.saveColorsWithService()"></Button></div>
      <div><Button label="Reset" @click="colorStore.resetColors()"></Button></div>
      <div><Button label="Daten exportieren" @click="exportLocalContentToFile()"></Button></div>
      <div><Button label="Daten importieren" @click="dialogStore.openImportDialog()"></Button></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

import { exportLocalContentToFile } from '@/services/exports.service';

import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';

import { useNavigationStore } from '@/stores/navigation';
import { useDialogStore } from '@/stores/dialogs';
import { useColorStore } from '@/stores/colors';

const navigationStore = useNavigationStore();
const colorStore = useColorStore();
const dialogStore = useDialogStore();

const leftBGColor = computed({
    get: () => colorStore.leftBGColor,
    set: (value) => colorStore.setLeftBGColor(value)
});

const rightBGColor = computed({
    get: () => colorStore.rightBGColor,
    set: (value) => colorStore.setRightBGColor(value)
});

</script>

<style scoped lang="scss"></style>
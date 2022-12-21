<template>
<Dialog header="Eintrag entfernen" v-model:visible="dialogStore.isConfirmDeleteDialogOpen"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false">
    <div>
        <div>Möchtest Du diesen Eintrag unwiderruflich löschen?</div>
        <Message v-if="confirmHint.length > 0" severity="warn" :closable="false">
            {{ confirmHint }}
        </Message>
    </div>
    <template #footer>
        <Button label="Abbrechen" @click="dialogStore.hideConfirmDeleteDialog()" class="p-button-text"/>
        <Button label="Löschen" @click="deleteClicked" />
    </template>
</Dialog>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialogs';
import { computed } from 'vue';

const dialogStore = useDialogStore();

const onConfirm = computed(() => dialogStore.onConfirmCallback);
const confirmHint = computed(() => dialogStore.confirmHintText);

const deleteClicked = () => {
    onConfirm.value();
    dialogStore.hideConfirmDeleteDialog();
};
</script>

<style scoped lang="scss">
.hint-message {
    color: red;
    font-size: .9rem;
    margin: 1rem 0;
}
</style>
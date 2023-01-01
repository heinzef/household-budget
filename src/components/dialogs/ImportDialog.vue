<template>
<Dialog header="Datensatz importieren" v-model:visible="dialogStore.isImportDialogOpen"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false">
    <div>
        <div><label>Datei auswählen:</label></div>
        <div><input type="file" id="importfile" name="importfile" /></div>
        <Message severity="warn" :closable="false">
            Dabei werden alle lokalen Daten überschrieben.
        </Message>
    </div>
    <template #footer>
        <Button label="Abbrechen" @click="dialogStore.hideImportDialog()" class="p-button-text"/>
        <Button label="Importieren" @click="importClicked" />
    </template>
</Dialog>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialogs';
import { importFileToLocalContent } from '@/services/exports.service';

const dialogStore = useDialogStore();

const importClicked = async () => {
    const importfileDomNode = document.getElementById('importfile');
    if (importfileDomNode.files && importfileDomNode.files.length > 0) {
        const file = importfileDomNode.files.item(0);
        const text = await file.text();
        importFileToLocalContent(text);
        setTimeout(() => window.location.reload(), 250);    
    }
    dialogStore.hideImportDialog();
};
</script>

<style scoped lang="scss">
</style>
<template>
    <Dialog header="Einen Benutzernamen vergeben" v-model:visible="isDialogOpen" :closable="false"
      :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true" :draggable="false">
      <div>
        <div><label>Benutzername:</label></div>
        <div class="p-inputgroup">
            <InputText v-model="userNameInput" @keyup.enter="saveUsername"/>
        </div>
      </div>
      <template #footer>
        <Button label="Speichern" @click="saveUsername" />
      </template>
    </Dialog>
  </template>
      
  <script setup>
  import { computed, ref } from 'vue';
  
  import { useProfileStore } from '@/stores/profile';
  
  const profileStore = useProfileStore();

  const isDialogOpen = computed(() => !profileStore.hasUserName);
  const userNameInput = ref('');
  
   
  
  const saveUsername = () => {
    if (userNameInput.value.length > 0) {
        profileStore.setUsername(userNameInput.value);
    }
  };
  
  </script>
  
  <style scoped lang="scss"></style>
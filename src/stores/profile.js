import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { loadProfile, saveProfile } from "@/services/profile.service";


export const useProfileStore = defineStore('profileStore', () => {
    const userName = ref('');
    const getUserName = computed(() => userName.value);

    const hasUserName = computed(() => userName.value && userName.value.length > 0);

    const setUsername = (name) => {
        userName.value = name;
        saveProfile(name);
    };

    const loadProfileFromService = () => {
        const profileObj = loadProfile();
        if (profileObj) {
            if(profileObj.userName) {
                userName.value = profileObj.userName;
            }
        }
    };

    loadProfileFromService();


    return {
        getUserName,
        hasUserName,
        setUsername,
    };
});
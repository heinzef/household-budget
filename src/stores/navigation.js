import { defineStore } from "pinia";
import { computed, ref } from "vue";

const lastPageVisited = localStorage.getItem('lastPageVisited');

export const useNavigationStore = defineStore('navigationStore', () => {
    const activePage = ref(lastPageVisited || 'overview');
    const getActivePage = computed(() => activePage.value);
    const setActivePage = (page) => {
        activePage.value = page;
        localStorage.setItem('lastPageVisited', page);
    }
    return {
        getActivePage,
        setActivePage,
    };
});
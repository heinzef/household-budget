import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useColorStore = defineStore('colorStore', () => {
    const leftBGColor = ref('#DBE3E5');
    const setLeftBGColor = (color) => leftBGColor.value = `#${color}`;

    const rightBGColor = ref('#809199');
    const setRightBGColor = (color) => rightBGColor.value = `#${color}`;

    return {
        leftBGColor,
        setLeftBGColor,
        rightBGColor,
        setRightBGColor,
    };
});
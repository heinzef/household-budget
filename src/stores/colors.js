import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { loadColors, saveColors } from "@/services/colors.service";

export const useColorStore = defineStore('colorStore', () => {
    const leftBGColor = ref('#DBE3E5');
    const setLeftBGColor = (color) => {
        const hexValue = color.charAt(0) !== '#' ? `#${color}` : color;
        leftBGColor.value = hexValue;
    };

    const rightBGColor = ref('#809199');
    const setRightBGColor = (color) => {
        const hexValue = color.charAt(0) !== '#' ? `#${color}` : color;
        rightBGColor.value = hexValue;
    };

    const loadColorsFromService = () => {
        const colorsObj = loadColors();
        if (colorsObj) {
            if (colorsObj.leftBGColor) {
                setLeftBGColor(colorsObj.leftBGColor);
            }
            if(colorsObj.rightBGColor) {
                setRightBGColor(colorsObj.rightBGColor);
            }
        }
    };

    loadColorsFromService();

    const resetColors = () => {
        setLeftBGColor('#DBE3E5');
        setRightBGColor('#809199');
        saveColors();
    }

    const saveColorsWithService = () => {
        saveColors(leftBGColor.value, rightBGColor.value);
    };

    return {
        leftBGColor,
        setLeftBGColor,
        rightBGColor,
        setRightBGColor,
        saveColorsWithService,
        resetColors,
    };
});
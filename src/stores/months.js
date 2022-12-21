import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { saveMonth, loadMonths } from "../services/month.service";

import { v4 } from "uuid";

export const useMonthStore = defineStore("monthStore", () => {
  const months = ref([]);
  const selectedMonth = ref(null);
  const setSelectedMonth = (month) => selectedMonth.value = month;

  const loadMonthsAction = async () => months.value = loadMonths();

  const getMonthsForDropdown = computed(() => {
    return months.value;
  });

  const getMonthById = (monthId) => months.value.find((m) => m.id === monthId);

  const addMonth = (monthName) => {
    const month = {
      id: v4(),
      name: monthName,
      createdAt: new Date(),
    }
    months.value = [...months.value, month];
    saveMonth(month);
  }

  loadMonthsAction();
  setTimeout(() => setSelectedMonth(months.value[0]), 300);

  return {
    months,
    getMonthById,
    getMonthsForDropdown,
    selectedMonth,
    setSelectedMonth,
    addMonth,
  }
});

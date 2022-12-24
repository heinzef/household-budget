import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { saveMonths, loadMonths } from "../services/month.service";

import { useIncomeStore } from "./incomes";
import { useCostsStore } from "./costs";
import { useSinkingFundsStore } from "./sinkingfunds";

import { v4 } from "uuid";

export const useMonthStore = defineStore("monthStore", () => {
  const incomeStore = useIncomeStore();
  const costsStore = useCostsStore();
  const sinkingFundsStore = useSinkingFundsStore();


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
    saveMonths(months.value);
  };

  const editMonth = (editItem, newName) => {
    const monthsCopy = [...months.value];
    const item = monthsCopy.find((m) => m.id === editItem.id);
    if (item) {
        item.name = newName;
        months.value = [...monthsCopy];
        saveMonths(months.value);
    }
  };

  const removeMonthById = (id) => {
    incomeStore.removeIncomesByMonthId(id);
    costsStore.removeCostsByMonth(id);
    sinkingFundsStore.removeSinkingFundPaymentsByMonth(id);
    months.value = months.value.filter((m) => m.id !== id);
    saveMonths(months.value);
  };

  loadMonthsAction();
  setTimeout(() => setSelectedMonth(months.value[0]), 300);

  return {
    months,
    getMonthById,
    getMonthsForDropdown,
    selectedMonth,
    setSelectedMonth,
    addMonth,
    editMonth,
    removeMonthById,
  }
});

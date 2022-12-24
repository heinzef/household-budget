import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { v4 } from "uuid";

import { loadIncomes, saveIncomes, loadIncomeCategories, saveIncomeCategories } from "@/services/incomes.service";

export const useIncomeStore = defineStore("incomeStore", () => {
    const incomes = ref([]);

    const getIncomeById = (id) => incomes.value.find((i) => i.id === id);
    
    const getIncomesForMonth = (monthId) => {
        return incomes.value.filter((inc) => inc.relatedMonth === monthId).map((inc) => ({...inc, name: getIncomeCategoryNameById(inc.relatedCategory)}));
    };

    const getIncomesForMonthReduced = (monthId) => getIncomesForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const addIncome = (name, value, relatedCategory, monthId) => {
        const incomeObject = {
            id: v4(),
            name,
            value,
            relatedCategory,
            relatedMonth: monthId || null,
            createdAt: new Date()
        };
        incomes.value = [...incomes.value, incomeObject];
        saveIncomes(incomes.value);
    }

    const removeIncomeById = (id) => {
        incomes.value = incomes.value.filter((inc) => inc.id !== id);
        saveIncomes(incomes.value);
    }

    const removeIncomeByCategoryId = (catId) => {
        incomes.value = incomes.value.filter((inc) => inc.relatedCategory !== catId);
        saveIncomes(incomes.value);
    }

    const removeIncomesByMonthId = (monthId) => {
        incomes.value = incomes.value.filter((inc) => inc.relatedMonth !== monthId);
        saveIncomes(incomes.value);
    }

    const incomeCategories = ref([]);
    const _incomeCategoryInputText = ref('');
    const incomeCategoryInputText = computed({
        get: () => _incomeCategoryInputText.value,
        set: (value) => _incomeCategoryInputText.value = value,
    });

    const getIncomeCategories = computed(() => incomeCategories.value);

    const getIncomeCategoryNameById = (id) => incomeCategories.value.find((incCat) => incCat.id === id)?.name || '';

    const getIncomeCategoryById = (id) => incomeCategories.value.find((incCat) => incCat.id === id);

    const addIncomeCategory = (cat = null) => {
        const category = {
            id: v4(),
            name: cat || _incomeCategoryInputText.value,
            createdAt: new Date()
        };
        incomeCategories.value = [...incomeCategories.value, category];
        saveIncomeCategories(incomeCategories.value);
    }

    const editIncomeCategory = (editItem, newName) => {
        const incomeCategoriesCopy = [...incomeCategories.value];
        const item = incomeCategoriesCopy.find((incC) => incC.id === editItem.id);
        if (item) {
            item.name = newName;
            incomeCategories.value = [...incomeCategoriesCopy];
            saveIncomeCategories(incomeCategories.value);
        }
    };

    const loadIncomesAndCategories = () => {
        incomes.value = [...loadIncomes()];
        incomeCategories.value = [...loadIncomeCategories()];
    }

    const removeIncomeCategoryById = (catId) => {
        removeIncomeByCategoryId(catId);
        incomeCategories.value = incomeCategories.value.filter((incC) => incC.id !== catId);
        saveIncomeCategories(incomeCategories.value);
    }

    loadIncomesAndCategories();

    const saveNewIncome = (name, value, relatedCategory, relatedMonth, editItem = null) => {
        if (!editItem) {
            addIncome(name, value, relatedCategory, relatedMonth);
        } else {
            const incomesCopy = [...incomes.value];
            const incomeObject = incomesCopy.find((i) => i.id === editItem.id);
            if (incomeObject) {
                incomeObject.name = name;
                incomeObject.value = value;
                incomeObject.relatedCategory = relatedCategory,
                incomeObject.relatedMonth = relatedMonth;
                incomes.value = [...incomesCopy];
                saveIncomes(incomes.value);
            }
        }
    };

    return {
        getIncomesForMonth,
        getIncomesForMonthReduced,
        removeIncomesByMonthId,
        getIncomeCategories,
        getIncomeCategoryById,
        getIncomeCategoryNameById,
        incomeCategoryInputText,
        addIncomeCategory,
        editIncomeCategory,
        removeIncomeCategoryById,
        saveNewIncome,
        removeIncomeById,
    }
});
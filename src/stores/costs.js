import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { saveCosts, loadCosts, saveCostPayments, loadCostPayments, saveCostsCategories, loadCostsCategories,
    saveCostCategoryGroups, loadCostCategoryGroups } from "@/services/costs.service";

export const useCostsStore = defineStore("costsStore", () => {
    const costs = ref([]);

    const getFixCostsForMonth = (monthId) => {
        return costs.value.filter((cost) => cost.relatedMonth === monthId && cost.isFixCost);
    };

    const getFixCostsForMonthReduced = (monthId) => getFixCostsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const getVarCostsForMonth = (monthId) => {
        return costs.value.filter((cost) => cost.relatedMonth === monthId && !cost.isFixCost);
    };

    const getVarCostsForMonthReduced = (monthId, paid = true) => getVarCostsForMonth(monthId).reduce((acc, curr) => acc + (paid ? curr.paid : curr.value), 0);

    const loadCostsFromService = () => costs.value = [...loadCosts()];
    loadCostsFromService();


    const addCost = (name, value, isFixCost, relatedCategory, monthId, editItem = null) => {
        if (!editItem) {
            const costObject = {
                id: v4(),
                name,
                value,
                isFixCost,
                relatedCategory,
                relatedMonth: monthId || null,
                paid: isFixCost ? value : 0,
                createdAt: new Date()
            }
        
            costs.value = [...costs.value, costObject];
        } else {
            const costsCopy = [...costs.value];
            const costObject = costsCopy.find((c) => c.id === editItem.id);
            if (costObject) {
                costObject.name = name;
                costObject.value = value;
                costObject.relatedCategory = relatedCategory,
                costObject.relatedMonth = monthId;
                costs.value = [...costsCopy];
            }
        }
        saveCosts(costs.value);
    }

    const getCostById = (id) => costs.value.find((c) => c.id === id);

    const removeCostById = (id) => {
        removeCostPaymentByCostId(id);
        costs.value = costs.value.filter((c) => c.id !== id);
        saveCosts(costs.value);
    }

    const removeCostsByMonth = (monthId) => {
        const costsToRemove = costs.value.filter((c) => c.relatedMonth === monthId);
        removeCostPaymentByCostIds(costsToRemove.map((ctr) => ctr.id));
        costs.value = costs.value.filter((c) => c.relatedMonth !== monthId);
        saveCosts(costs.value);
    }

    const removeCostsByCategory = (catId) => {
        const costsToRemove = costs.value.filter((c) => c.relatedCategory === catId);
        removeCostPaymentByCostIds(costsToRemove.map((ctr) => ctr.id));
        costs.value = costs.value.filter((c) => c.relatedCategory !== catId);
        saveCosts(costs.value);
    }

    const costPayments = ref([]);
    const addCostPayment = (relatedCostId, value, comment = '') => {
        const cost = getCostById(relatedCostId);
        if (cost) {
            const costPayment = {
                id: v4(),
                relatedCostId,
                value,
                comment,
                createdAt: new Date()
            };
            cost.paid = cost.paid + value;
            costPayments.value = [...costPayments.value, costPayment];
            saveCostPayments(costPayments.value);
            saveCosts(costs.value);
        }
    }

    const removeCostPaymentByCostId = (costId) => {
        costPayments.value = costPayments.value.filter((cp) => cp.relatedCostId !== costId);
        saveCostPayments(costPayments.value);
    };

    const removeCostPaymentByCostIds = (costIds) => {
        costPayments.value = costPayments.value.filter((cp) => !costIds.includes(cp.relatedCostId));
        saveCostPayments(costPayments.value);
    };

    const loadCostPaymentsFromService = () => costPayments.value = [...loadCostPayments()];
    loadCostPaymentsFromService();

    const costCategories = ref([]);

    const getFixCostCategories = computed(() => costCategories.value.filter((cc) => cc.isFixCost));
    const getVarCostCategories = computed(() => costCategories.value.filter((cc) => !cc.isFixCost));
    const getAllCostCategories = computed(() => costCategories.value);

    const loadCostsCategoriesFromService = () => costCategories.value = [...loadCostsCategories()];
    loadCostsCategoriesFromService();

    const addCostCategory = (name, isFixCost, relatedGroup) => {
        const category = {
            id: v4(),
            name,
            isFixCost,
            relatedGroup,
            createdAt: new Date()
        };
        costCategories.value = [...costCategories.value, category];
        saveCostsCategories(costCategories.value);
    }

    const getCostCategoryById = (id) => costCategories.value.find((cc) => cc.id === id);

    const removeCostCategoryById = (id) => {
        removeCostsByCategory(id);
        costCategories.value = costCategories.value.filter((cc) => cc.id !== id);
        saveCostsCategories(costCategories.value);
    }

    const removeCostCategoriesByGroupId = (groupId) => {
        costCategories.value = costCategories.value.filter((cc) => cc.relatedGroup !== groupId);
        saveCostsCategories(costCategories.value);
    }

    const getCostsForCategory = (categoryId, monthId = null) => {
        const costsForCat =  costs.value.filter((c) => c.relatedCategory === categoryId &&
            (monthId ? c.relatedMonth === monthId : true));
        return costsForCat;
    };

    const costCategoryGroups = ref([]);
    const getCategoryGroups = computed(() => costCategoryGroups.value);

    const loadCostCategoryGroupsFromService = () => costCategoryGroups.value = [...loadCostCategoryGroups()];
    loadCostCategoryGroupsFromService();

    const addCostCategoryGroup = (name) => {
        const group = {
            id: v4(),
            name,
            createdAt: new Date()
        };
        costCategoryGroups.value = [...costCategoryGroups.value, group];
        saveCostCategoryGroups(costCategoryGroups.value);
    };

    const editCostCategoryGroup = (editItem, newName) => {
        const groupsCopy = [...costCategoryGroups.value];
        const item = groupsCopy.find((g) => g.id === editItem.id);
        if (item) {
            item.name = newName;
            costCategoryGroups.value = [...groupsCopy];
            saveCostCategoryGroups(costCategoryGroups.value);
        }
    };

    const getCostCategoriesForGroup = (groupId) => costCategories.value.filter((cc) => cc.relatedGroup === groupId);

    const getCostsForCategoryGroup = (groupdId, monthId = null) => {
        const costs = [];
        getCostCategoriesForGroup(groupdId).forEach((cc) => {
            costs.push(getCostsForCategory(cc.id, monthId));
        });
        return costs;
    };

    const removeCostCategoryGroupById = (id) => {
        const categories = getCostCategoriesForGroup(id);
        categories.forEach((cat) => {
            removeCostsByCategory(cat.id);
        })
        removeCostCategoriesByGroupId(id);
        costCategoryGroups.value = costCategoryGroups.value.filter((ccGroup) => ccGroup.id !== id);
        saveCostCategoryGroups(costCategoryGroups.value);
    };

    const getCostsForMonthGrouped = (monthId) => {
        const data = [];
        costCategoryGroups.value.forEach((cGroup) => {
            const dataEntry = {
                name: cGroup.name,
                value: 0,
            };
            const relatedCosts = getCostsForCategoryGroup(cGroup.id, monthId);
            if (relatedCosts && relatedCosts.length > 0) {
                dataEntry.value = relatedCosts.reduce((acc, curr) => acc + curr.reduce((a, c) => a + c.paid, 0), 0);
            }
            if (dataEntry.value > 0) {
                data.push(dataEntry);
            }
        });
        return data;
    }

    return {
        getFixCostsForMonth,
        getFixCostsForMonthReduced,
        getVarCostsForMonth,
        getVarCostsForMonthReduced,
        addCost,
        getCostById,
        removeCostById,
        removeCostsByCategory,
        removeCostsByMonth,
        addCostPayment,
        getFixCostCategories,
        getVarCostCategories,
        getAllCostCategories,
        addCostCategory,
        removeCostCategoryById,
        getCostCategoryById,
        costCategoryGroups,
        getCategoryGroups,
        addCostCategoryGroup,
        editCostCategoryGroup,
        removeCostCategoryGroupById,
        getCostCategoriesForGroup,
        getCostsForCategoryGroup,
        getCostsForMonthGrouped,
    }
});
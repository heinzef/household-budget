import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { saveCosts, loadCosts, saveCostPayments, loadCostPayments, saveCostsCategories, loadCostsCategories,
    saveCostCategoryGroups, loadCostCategoryGroups } from "@/services/costs.service";

export const useCostsStore = defineStore("costsStore", () => {
    const costs = ref([]);

    const getFixCostsForMonth = (monthId) => {
        return costs.value.filter((cost) => cost.relatedMonth === monthId && cost.isFixCost)
            .map((c) => ({...c, name: getCostCategoryNameById(c.relatedCategory)}));
    };

    const getFixCostsForMonthReduced = (monthId) => getFixCostsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const getVarCostsForMonth = (monthId) => {
        return costs.value.filter((cost) => cost.relatedMonth === monthId && !cost.isFixCost)
            .map((c) => ({...c, name: getCostCategoryNameById(c.relatedCategory)}));;
    };

    const getVarCostsForMonthReduced = (monthId, paid = true) => getVarCostsForMonth(monthId).reduce((acc, curr) => acc + (paid ? getVarCostPaidValueById(curr.id) : curr.value), 0);

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

    const getVarCostPaidValueById = (id) => {
        return costPayments.value.filter((cp) => cp.relatedCostId === id).reduce((acc, curr) => acc + curr.value, 0);
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
            costPayments.value = [...costPayments.value, costPayment];
            saveCostPayments(costPayments.value);
        }
    }
    
    const editCostPayment = (paymentId, value, comment = '') => {
        const costPayment = costPayments.value.find((cp) => cp.id === paymentId);
        if (costPayment) {
            costPayment.value = value;
            costPayment.comment = comment;
            saveCostPayments(costPayments.value);
        }
    }

    const getCostPaymentsForRelatedCost = (relatedCostId) => {
        return costPayments.value.filter((cp) => cp.relatedCostId === relatedCostId);
    };

    const removeCostPaymentById = (id) => {
        costPayments.value = costPayments.value.filter((cp) => cp.id !== id);
        saveCostPayments(costPayments.value);
    };

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

    const editCostCategory = (editItem, newName, isFixCost, relatedGroup) => {
        const categoriesCopy = [...costCategories.value];
        const item = categoriesCopy.find((cc) => cc.id === editItem.id);
        if (item) {
            item.name = newName;
            item.isFixCost = isFixCost;
            item.relatedGroup = relatedGroup;
            costCategories.value = [...categoriesCopy];
            saveCostsCategories(costCategories.value);
        }
    };

    const getCostCategoryById = (id) => costCategories.value.find((cc) => cc.id === id);
    const getCostCategoryNameById = (id) => {
        const category = costCategories.value.find((cc) => cc.id === id);
        if (category) return category.name;
        return '';
    };

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

    const getCostCategoryGroupById = (id) => costCategoryGroups.value.find((g) => g.id === id);

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
                dataEntry.value = relatedCosts.reduce((acc, curr) => acc + curr.reduce((a, c) => a + c.isFixCost ? c.value : getVarCostPaidValueById(c.id), 0), 0);
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
        getVarCostPaidValueById,
        addCostPayment,
        editCostPayment,
        removeCostPaymentById,
        getCostPaymentsForRelatedCost,
        getFixCostCategories,
        getVarCostCategories,
        getAllCostCategories,
        addCostCategory,
        editCostCategory,
        removeCostCategoryById,
        getCostCategoryById,
        costCategoryGroups,
        getCategoryGroups,
        addCostCategoryGroup,
        editCostCategoryGroup,
        getCostCategoryGroupById,
        removeCostCategoryGroupById,
        getCostCategoriesForGroup,
        getCostsForCategoryGroup,
        getCostsForMonthGrouped,
    }
});
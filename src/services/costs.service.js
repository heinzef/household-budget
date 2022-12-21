export const loadCosts = () => {
    let costs = [];
    const costsAsString = localStorage.getItem('costs');
    if (costsAsString && costsAsString.length > 0) {
        costs = JSON.parse(costsAsString);
    }
    return costs;
};

export const saveCosts = (costs) => {
   localStorage.setItem('costs', JSON.stringify(costs));
};

export const loadCostPayments = () => {
    let payments = [];
    const paymentsAsString = localStorage.getItem('cost_payments');
    if (paymentsAsString && paymentsAsString.length > 0) {
        payments = JSON.parse(paymentsAsString);
    }
    return payments;
};

export const saveCostPayments = (payments) => {
   localStorage.setItem('cost_payments', JSON.stringify(payments));
};

export const loadCostsCategories = () => {
    let categories = [];
    const categoriesAsString = localStorage.getItem('costs_categories');
    if (categoriesAsString && categoriesAsString.length > 0) {
        categories = JSON.parse(categoriesAsString);
    }
    return categories;
};

export const saveCostsCategories = (categories) => {
   localStorage.setItem('costs_categories', JSON.stringify(categories));
};

export const loadCostCategoryGroups = () => {
    let groups = [];
    const groupsAsString = localStorage.getItem('costs_category_groups');
    if (groupsAsString && groupsAsString.length > 0) {
        groups = JSON.parse(groupsAsString);
    }
    return groups;
};

export const saveCostCategoryGroups = (groups) => {
    localStorage.setItem('costs_category_groups', JSON.stringify(groups));
}
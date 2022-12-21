export const loadIncomes = () => {
    let incomes = [];
    const incomesAsString = localStorage.getItem('incomes');
    if (incomesAsString && incomesAsString.length > 0) {
        incomes = JSON.parse(incomesAsString);
    }
    return incomes;
};

export const saveIncomes = (incomes) => {
   localStorage.setItem('incomes', JSON.stringify(incomes));
}

export const loadIncomeCategories = () => {
    let categories = [];
    const categoriesAsString = localStorage.getItem('income_categories');
    if (categoriesAsString && categoriesAsString.length > 0) {
        categories = JSON.parse(categoriesAsString);
    }
    return categories;
};

export const saveIncomeCategories = (categories) => {
   localStorage.setItem('income_categories', JSON.stringify(categories));
}
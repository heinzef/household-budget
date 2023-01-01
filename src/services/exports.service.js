const localStorageKeys = ['lastPageVisited', 'costs_category_groups', 'costs', 'profile', 'sinkingfunds', 'sinkingfunds_payments', 'costs_categories', 'colors',
    'incomes', 'months', 'income_categories', 'cost_payments'];

export const exportLocalContentToFile = () => {
    const exportObj = {};
    for (const key of localStorageKeys) {
        const localStorageItem = localStorage.getItem(key);
        if (localStorageItem) {
            if (key !== 'lastPageVisited') {
                exportObj[key] = JSON.parse(localStorageItem);
            } else {
                exportObj[key] = localStorageItem
            }
           
        }
    }
    download('household-budget.json', JSON.stringify(exportObj));

};

export const importFileToLocalContent = (filecontent) => {
    const importObj = JSON.parse(filecontent);
    if (importObj) {
        for (const key of Object.keys(importObj)) {
            if (key !== 'lastPageVisited') {
                localStorage.setItem(key, JSON.stringify(importObj[key]));
            } else {
                localStorage.setItem('lastPageVisited', 'overview');
            }
        }
    }
};

const download = (filename, text, type="text/plain") => {
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(
        new Blob([text], { type })
    );
    a.setAttribute("download", filename);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
};
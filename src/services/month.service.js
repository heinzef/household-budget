export const saveMonth = (month) => {
    let months = [];
    const monthsAsString = localStorage.getItem('months');
    if (monthsAsString && monthsAsString.length > 0) {
        months = JSON.parse(monthsAsString);
    }
    months.push(month);
    localStorage.setItem('months', JSON.stringify(months));
};

export const loadMonths = () => {
    let months = [];
    const monthsAsString = localStorage.getItem('months');
    if (monthsAsString && monthsAsString.length > 0) {
        months = JSON.parse(monthsAsString);
    }
    return months;
}
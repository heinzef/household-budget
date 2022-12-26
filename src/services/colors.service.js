export const saveColors = (leftBGColor, rightBGColor) => {
    const colorsObj = {
        leftBGColor,
        rightBGColor,
    };
    localStorage.setItem('colors', JSON.stringify(colorsObj));
}

export const loadColors = () => {
    let colorsObj = {};
    const colorsAsString = localStorage.getItem('colors');
    if (colorsAsString && colorsAsString.length > 0) {
        colorsObj = JSON.parse(colorsAsString);
    }
    return colorsObj;
}
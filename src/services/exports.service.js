import * as XLSX from 'xlsx';
import dateformat from 'dateformat';

import { useMonthStore } from '../stores/months';
import { useIncomeStore } from '../stores/incomes';
import { useCostsStore } from '../stores/costs';
import { useSinkingFundsStore } from '../stores/sinkingfunds';

export const exportSelectedMonthToExcel = () => {
    const monthStore = useMonthStore();
    const selectedMonth = monthStore.selectedMonth;
    if (selectedMonth) {

        const incomeStore = useIncomeStore();
        const costsStore = useCostsStore();
        const sinkingFundsStore = useSinkingFundsStore();

        const wb = XLSX.utils.book_new();
        
        // Übersicht Sheet
        let sheetData = [
            incomeStore.getIncomesForMonthReduced(selectedMonth.id),
            costsStore.getFixCostsForMonthReduced(selectedMonth.id) + costsStore.getVarCostsForMonthReduced(selectedMonth.id),
            sinkingFundsStore.getPositiveSinkingFundPaymentsForMonthReduced(selectedMonth.id),
            sinkingFundsStore.getNegativeSinkingFundPaymentsForMonthReduced(selectedMonth.id)
        ];
        let ws = XLSX.utils.aoa_to_sheet([['Einnahmen', 'Kosten', 'Spartopf Einzahlung', 'Spartopf Ausgaben'], sheetData]);
        XLSX.utils.book_append_sheet(wb, ws, "Übersicht");

        // Einnahmen Sheet
        const incomes = incomeStore.getIncomesForMonth(selectedMonth.id);
        const incomesMapped = incomes.map((inc) => [inc.name, inc.value]);
        ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert'], ...incomesMapped]);
        XLSX.utils.book_append_sheet(wb, ws, "Einnahmen");

        // Fixkosten Sheet
        const fixcosts = costsStore.getFixCostsForMonth(selectedMonth.id);
        const fixcostsMapped = fixcosts.map((c) => [c.name, c.value]);
        ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert'], ...fixcostsMapped]);
        XLSX.utils.book_append_sheet(wb, ws, "Fixkosten");

        // Var. Kosten Sheet
        const varcosts = costsStore.getVarCostsForMonth(selectedMonth.id);
        const varcostsMapped = varcosts.map((c) => [c.name, c.value, costsStore.getVarCostPaidValueById(c.id), Math.abs(c.value) - costsStore.getVarCostPaidValueById(c.id)]);
        ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert', 'Ausgegeben', 'Verfügbar'], ...varcostsMapped]);
        XLSX.utils.book_append_sheet(wb, ws, "Variable Kosten");

        // Spartopf-Einzahlungen Sheet
        let payments = sinkingFundsStore.getPositiveSinkingFundPaymentsForMonth(selectedMonth.id);
        let paymentsMapped = payments.map((p) => [p.name, p.value]);
        ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert'], ...paymentsMapped]);
        XLSX.utils.book_append_sheet(wb, ws, "Spartopf-Einzahlungen");

        // Spartopf-Ausgaben Sheet
        payments = sinkingFundsStore.getNegativeSinkingFundPaymentsForMonth(selectedMonth.id);
        paymentsMapped = payments.map((p) => [p.name, Math.abs(p.value), p.comment]);
        ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert', 'Kommentar'], ...paymentsMapped]);
        XLSX.utils.book_append_sheet(wb, ws, "Spartopf-Ausgaben");


        // Download
        XLSX.writeFile(wb, `${selectedMonth.name}.xlsx`);
    }
    
};

export const exportSinkingFundsToExcel = () => {
    const sinkingFundsStore = useSinkingFundsStore();
    const sinkingfunds = sinkingFundsStore.getSinkingFundsSortable;

    const wb = XLSX.utils.book_new();

    // Spartöpfe Sheet
    const sinkingfundsMapped = sinkingfunds.map((sf) => [sf.name, sf.value]);
    const ws = XLSX.utils.aoa_to_sheet([['Name', 'Wert'], ...sinkingfundsMapped]);
    XLSX.utils.book_append_sheet(wb, ws, "Spartöpfe");

    // Format Date for Filename
    const dateNowAsString = dateformat(new Date(), 'dd-mm-yyyy_HH-MM-ss');

    // Download
    XLSX.writeFile(wb, `Spartoepfe_${dateNowAsString}.xlsx`);
};


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
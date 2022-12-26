import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { saveSinkingFunds, loadSinkingFunds, saveSinkingFundPayments, loadSinkingFundPayments } from "@/services/sinkingfunds.service";

export const useSinkingFundsStore = defineStore("sinkingFundsStore", () => {
    const sinkingfunds = ref([]);
    const getSinkingFunds = computed(() => sinkingfunds.value);
    const getSinkingFundsSortable = computed(() => sinkingfunds.value.map((sf) => ({ ...sf, value: sf.value + getPaymentsOfSinkingFundReduced(sf.id)})));
    const getSinkingFundsReduced = computed(() => sinkingfunds.value.reduce((acc, curr) => acc + curr.value + getPaymentsOfSinkingFundReduced(curr.id), 0));

    const getSinkingFundById = (id) => sinkingfunds.value.find((sf) => sf.id === id);
    const getSinkingFundNameById = (id) => {
        const sf = sinkingfunds.value.find((sf) => sf.id === id);
        if (sf) return sf.name;
        return '';
    };

    const addSinkingFund = (name, value) => {
        const sinkingfundObject = {
            id: v4(),
            name,
            value,
            createdAt: new Date()
        };
        sinkingfunds.value = [...sinkingfunds.value, sinkingfundObject];
        saveSinkingFunds(sinkingfunds.value);
    }

    const editSinkingFund = (editItem, newName, newValue) => {
        const sinkingFundsCopy = [...sinkingfunds.value];
        const item = sinkingFundsCopy.find((sf) => sf.id === editItem.id);
        if (item) {
            item.name = newName;
            item.value = newValue;
            sinkingfunds.value = [...sinkingFundsCopy];
            saveSinkingFunds(sinkingfunds.value);
        }
    };
    
    const loadSinkingFundsFromService = () => {
        sinkingfunds.value = [...loadSinkingFunds()];
    };
    loadSinkingFundsFromService();

    const removeSinkingFundById = (id) => {
        removeSinkingFundPaymentsBySF(id);
        sinkingfunds.value = sinkingfunds.value.filter((sf) => sf.id !== id);
        saveSinkingFunds(sinkingfunds.value);
    }

    const sinkingFundsPayments = ref([]);

    const getPaymentsOfSinkingFund = (sinkingFundId) => sinkingFundsPayments.value.filter((sp) => sp.relatedSF === sinkingFundId)
        .map((sp) => ({...sp, name: getSinkingFundNameById(sp.relatedSF)}));
    const getPaymentsOfSinkingFundReduced = (sinkingFundId) => getPaymentsOfSinkingFund(sinkingFundId).reduce((acc, curr) => acc + curr.value, 0);

    const getSinkingFundsPaymentsForMonth = (monthId) => sinkingFundsPayments.value.filter((sp) => sp.relatedMonth === monthId)
        .map((sp) => ({...sp, name: getSinkingFundNameById(sp.relatedSF)}));

    const getPositiveSinkingFundPaymentsForMonth = (monthId) => getSinkingFundsPaymentsForMonth(monthId).filter((sp) => sp.value >= 0);
    const getPositiveSinkingFundPaymentsForMonthReduced = (monthId) => getPositiveSinkingFundPaymentsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const getNegativeSinkingFundPaymentsForMonth = (monthId) => getSinkingFundsPaymentsForMonth(monthId).filter((sp) => sp.value < 0);
    const getNegativeSinkingFundPaymentsForMonthReduced = (monthId) => getNegativeSinkingFundPaymentsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const addSinkingFundPayment = (name, value, relatedSF, relatedMonth, comment, editItem = null) => {
        if (!editItem) {
            const paymentObject = {
                id: v4(),
                name,
                value,
                comment: value >= 0 ? 'Einzahlung' : comment,
                relatedSF,
                relatedMonth,
                createdAt: new Date()
            };
            sinkingFundsPayments.value = [...sinkingFundsPayments.value, paymentObject];
        } else {
            const sfpCopy = [...sinkingFundsPayments.value];
            const sfpObject = sfpCopy.find((sfp) => sfp.id === editItem.id);
            if (sfpObject) {
                sfpObject.name = name;
                sfpObject.value = value;
                sfpObject.relatedSF = relatedSF,
                sfpObject.relatedMonth = relatedMonth;
                sfpObject.comment = value >= 0 ? 'Einzahlung' : comment;
                sinkingFundsPayments.value = [...sfpCopy];
            }
        }
        saveSinkingFundPayments(sinkingFundsPayments.value);
    };

    const removeSinkingFundPaymentById = (id) => {
        sinkingFundsPayments.value = sinkingFundsPayments.value.filter((sp) => sp.id !== id);
        saveSinkingFundPayments(sinkingFundsPayments.value);
    }

    const removeSinkingFundPaymentsBySF = (sfId) => {
        sinkingFundsPayments.value = sinkingFundsPayments.value.filter((sp) => sp.relatedSF !== sfId);
        saveSinkingFundPayments(sinkingFundsPayments.value);
    }

    const removeSinkingFundPaymentsByMonth = (monthId) => {
        sinkingFundsPayments.value = sinkingFundsPayments.value.filter((sp) => sp.relatedMonth !== monthId);
        saveSinkingFundPayments(sinkingFundsPayments.value);
    }

    const loadSinkingFundPaymentsFromService = () => sinkingFundsPayments.value = [...loadSinkingFundPayments()];
    loadSinkingFundPaymentsFromService();

    return {
        getSinkingFunds,
        getSinkingFundsSortable,
        getSinkingFundsReduced,
        addSinkingFund,
        editSinkingFund,
        removeSinkingFundById,
        getSinkingFundById,
        getPaymentsOfSinkingFund,
        getPaymentsOfSinkingFundReduced,
        getSinkingFundsPaymentsForMonth,
        getPositiveSinkingFundPaymentsForMonth,
        getPositiveSinkingFundPaymentsForMonthReduced,
        getNegativeSinkingFundPaymentsForMonth,
        getNegativeSinkingFundPaymentsForMonthReduced,
        addSinkingFundPayment,
        removeSinkingFundPaymentById,
        removeSinkingFundPaymentsByMonth,
    }
});
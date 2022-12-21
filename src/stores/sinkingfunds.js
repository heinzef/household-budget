import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { saveSinkingFunds, loadSinkingFunds, saveSinkingFundPayments, loadSinkingFundPayments } from "@/services/sinkingfunds.service";

export const useSinkingFundsStore = defineStore("sinkingFundsStore", () => {
    const sinkingfunds = ref([]);
    const getSinkingFunds = computed(() => sinkingfunds.value);
    const getSinkingFundsReduced = computed(() => sinkingfunds.value.reduce((acc, curr) => acc + curr.value + getPaymentsOfSinkingFundReduced(curr.id), 0));

    const getSinkingFundById = (id) => sinkingfunds.value.find((sf) => sf.id === id);

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
    
    const loadSinkingFundsFromService = () => {
        sinkingfunds.value = [...loadSinkingFunds()];
    };
    loadSinkingFundsFromService();

    const removeSinkingFundById = (id) => {
        sinkingfunds.value = sinkingfunds.value.filter((sf) => sf.id !== id);
        saveSinkingFunds(sinkingfunds.value);
    }

    const sinkingFundsPayments = ref([]);

    const getPaymentsOfSinkingFund = (sinkingFundId) => sinkingFundsPayments.value.filter((sp) => sp.relatedSF === sinkingFundId);
    const getPaymentsOfSinkingFundReduced = (sinkingFundId) => getPaymentsOfSinkingFund(sinkingFundId).reduce((acc, curr) => acc + curr.value, 0);

    const getSinkingFundsPaymentsForMonth = (monthId) => sinkingFundsPayments.value.filter((sp) => sp.relatedMonth === monthId);

    const getAllPositiveSinkingFundPaymentsForMonth = (monthId) => getSinkingFundsPaymentsForMonth(monthId).filter((sp) => sp.value >= 0);
    const getPositiveSinkingFundPaymentsForMonth = (monthId) => getSinkingFundsPaymentsForMonth(monthId).filter((sp) => sp.value >= 0 && sp.includeInCalc);
    const getPositiveSinkingFundPaymentsForMonthReduced = (monthId) => getPositiveSinkingFundPaymentsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const getNegativeSinkingFundPaymentsForMonth = (monthId) => getSinkingFundsPaymentsForMonth(monthId).filter((sp) => sp.value < 0 && sp.includeInCalc);
    const getNegativeSinkingFundPaymentsForMonthReduced = (monthId) => getNegativeSinkingFundPaymentsForMonth(monthId).reduce((acc, curr) => acc + curr.value, 0);

    const addSinkingFundPayment = (name, value, relatedSF, relatedMonth, includeInCalc = true, editItem = null) => {
        if (!editItem) {
            const paymentObject = {
                id: v4(),
                name,
                value,
                relatedSF,
                relatedMonth,
                includeInCalc,
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
                sfpObject.includeInCalc = includeInCalc,
                sinkingFundsPayments.value = [...sfpCopy];
            }
        }
        saveSinkingFundPayments(sinkingFundsPayments.value);
    };

    const removeSinkingFundPaymentById = (id) => {
        sinkingFundsPayments.value = sinkingFundsPayments.value.filter((sp) => sp.id !== id);
        saveSinkingFundPayments(sinkingFundsPayments.value);
    }

    const loadSinkingFundPaymentsFromService = () => sinkingFundsPayments.value = [...loadSinkingFundPayments()];
    loadSinkingFundPaymentsFromService();

    return {
        getSinkingFunds,
        getSinkingFundsReduced,
        addSinkingFund,
        removeSinkingFundById,
        getSinkingFundById,
        getPaymentsOfSinkingFund,
        getPaymentsOfSinkingFundReduced,
        getSinkingFundsPaymentsForMonth,
        getAllPositiveSinkingFundPaymentsForMonth,
        getPositiveSinkingFundPaymentsForMonth,
        getPositiveSinkingFundPaymentsForMonthReduced,
        getNegativeSinkingFundPaymentsForMonth,
        getNegativeSinkingFundPaymentsForMonthReduced,
        addSinkingFundPayment,
        removeSinkingFundPaymentById,
    }
});
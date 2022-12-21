import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useMonthStore } from "./months";
import { useIncomeStore } from "./incomes";
import { useCostsStore } from "./costs";
import { useSinkingFundsStore } from "./sinkingfunds";

export const useDialogStore = defineStore('dialogStore', () => {
    const monthStore = useMonthStore();
    const incomeStore = useIncomeStore();
    const costsStore = useCostsStore();
    const sinkingFundsStore = useSinkingFundsStore();

    const newCategoryDialogOpen = ref(false);
    const newCategoryFor = ref(null);
    const _newCategoryInputText = ref('');
    const newCategoryInputText = computed({
        get: () => _newCategoryInputText.value,
        set: (value) => _newCategoryInputText.value = value,
    });
    const isNewCategoryDialogOpen = computed({
        get: () => newCategoryDialogOpen.value,
        set: (value) => newCategoryDialogOpen.value = value,
    });
    const openNewCategoryDialog = (forType) => {
        _newCategoryInputText.value = '';
        newCategoryFor.value = forType;
        newCategoryDialogOpen.value = true;
    }
    const hideNewCategoryDialog = () => newCategoryDialogOpen.value = false;

    const newMoneyEntryDialogOpen = ref(false);
    const isNewMoneyEntryDialogOpen = computed({
        get: () => newMoneyEntryDialogOpen.value,
        set: (value) => newMoneyEntryDialogOpen.value = value,
    });
    const _newMoneyEntryType = ref('');
    const newMoneyEntryType = computed(() => _newMoneyEntryType.value)

    const _newMoneyEntryAmountInput = ref(0);
    const newMoneyEntryAmountInput = computed({
        get: () => _newMoneyEntryAmountInput.value,
        set: (value) => _newMoneyEntryAmountInput.value = value,
    });

    const _newMoneyEntryRelatedItem = ref(null);
    const newMoneyEntryRelatedItem = computed({
        get: () => _newMoneyEntryRelatedItem.value,
        set: (value) => _newMoneyEntryRelatedItem.value = value,
    });

    const _newMoneyEntryRelatedMonth = ref(null);
    const newMoneyEntryRelatedMonth = computed({
        get: () => _newMoneyEntryRelatedMonth.value,
        set: (value) => _newMoneyEntryRelatedMonth.value = value,
    });
    
    const setNewMoneyEntryRelatedMonth = (month) => _newMoneyEntryRelatedMonth.value = month;

    
    const newMoneyEntryDialogIsInEditMode = ref(false);
    const newMoneyEntryEditItem = ref(null);

    const openNewMoneyEntryDialog = (forType, editMode = false, editItem = null) => {
        _newMoneyEntryType.value = forType;
        newMoneyEntryDialogIsInEditMode.value = editMode;
        newMoneyEntryEditItem.value = editItem;
        if (!editMode) {
            _newMoneyEntryAmountInput.value = 0;
            _newMoneyEntryRelatedItem.value = null;
        } else {
            _newMoneyEntryAmountInput.value = Math.abs(editItem.value);
            _newMoneyEntryRelatedMonth.value = monthStore.getMonthById(editItem.relatedMonth);
            if (forType === 'income') {
                _newMoneyEntryRelatedItem.value = incomeStore.getIncomeCategoryById(editItem.relatedCategory);
            } else if (forType === 'fixcost') {
                _newMoneyEntryRelatedItem.value = costsStore.getCostCategoryById(editItem.relatedCategory);
            } else if (forType === 'varcost') {
                _newMoneyEntryRelatedItem.value = costsStore.getCostCategoryById(editItem.relatedCategory);
            } else if (forType === 'sinkingfunddeposit') {
                _newMoneyEntryRelatedItem.value = sinkingFundsStore.getSinkingFundById(editItem.relatedSF);
            } else if (forType === 'sinkingfundwithdraw') {
                _newMoneyEntryRelatedItem.value = sinkingFundsStore.getSinkingFundById(editItem.relatedSF);
            }
        }
        newMoneyEntryDialogOpen.value = true;
    }
    const hideNewMoneyEntryDialog = () => newMoneyEntryDialogOpen.value = false;


    const _newCostPaymentDialogOpen = ref(false);
    const isNewCostPaymentDialogOpen = computed({
        get: () => _newCostPaymentDialogOpen.value,
        set: (value) => _newCostPaymentDialogOpen.value = value,
    });

    const newCostPaymentRelatedCostName = ref('');
    const newCostPaymentRelatedCostId = ref('');

    const openNewCostPaymentDialog = (forCost, forCostId) => {
        newCostPaymentRelatedCostName.value = forCost;
        newCostPaymentRelatedCostId.value = forCostId;
        _newCostPaymentDialogOpen.value = true;
    };

    const hideNewCostPaymentDialog = () => _newCostPaymentDialogOpen.value = false;

    const pieChartRelatedCategory = ref('');
    
    const _isPieChartDialogOpen = ref(false);
    const isPieChartDialogOpen = computed({
        get: () => _isPieChartDialogOpen.value,
        set: (value) => _isPieChartDialogOpen.value = value,
    });

    const openPieChartDialog = (relatedCategory) => {
        pieChartRelatedCategory.value = relatedCategory;
        _isPieChartDialogOpen.value = true;
    }

    const _isConfirmDeleteDialogOpen = ref(false);
    const isConfirmDeleteDialogOpen = computed({
        get: () => _isConfirmDeleteDialogOpen.value,
        set: (value) => _isConfirmDeleteDialogOpen.value = value,
    });

    const onConfirmCallback = ref(() => {});

    const openConfirmDeleteDialog = (onConfirm) => {
        onConfirmCallback.value = onConfirm;
        _isConfirmDeleteDialogOpen.value = true;
    };
    const hideConfirmDeleteDialog = () => _isConfirmDeleteDialogOpen.value = false;

    const _manageCategoriesDialogOpen = ref(false);
    const isManageCategoriesDialogOpen = computed({
        get: () => _manageCategoriesDialogOpen.value,
        set: (value) => _manageCategoriesDialogOpen.value = value,
    });

    const manageCategoriesDialogCategoryType = ref('');

    const openManageCategoriesDialog = (forType) => {
        manageCategoriesDialogCategoryType.value = forType;
        _manageCategoriesDialogOpen.value = true;
    };
    const hideManageCategoriesDialog = () => _manageCategoriesDialogOpen.value = false;

    return {
        newCategoryFor,
        newCategoryInputText,
        isNewCategoryDialogOpen,
        openNewCategoryDialog,
        hideNewCategoryDialog,
        newMoneyEntryType,
        isNewMoneyEntryDialogOpen,
        newMoneyEntryDialogIsInEditMode,
        newMoneyEntryEditItem,
        openNewMoneyEntryDialog,
        hideNewMoneyEntryDialog,
        newMoneyEntryAmountInput,
        newMoneyEntryRelatedItem,
        newMoneyEntryRelatedMonth,
        setNewMoneyEntryRelatedMonth,
        isNewCostPaymentDialogOpen,
        newCostPaymentRelatedCostName,
        newCostPaymentRelatedCostId,
        openNewCostPaymentDialog,
        hideNewCostPaymentDialog,
        pieChartRelatedCategory,
        isPieChartDialogOpen,
        openPieChartDialog,
        isConfirmDeleteDialogOpen,
        onConfirmCallback,
        openConfirmDeleteDialog,
        hideConfirmDeleteDialog,
        isManageCategoriesDialogOpen,
        manageCategoriesDialogCategoryType,
        openManageCategoriesDialog,
        hideManageCategoriesDialog,
    };
});
export const loadSinkingFundPayments = () => {
    let payments = [];
    const paymentsAsString = localStorage.getItem('sinkingfunds_payments');
    if (paymentsAsString && paymentsAsString.length > 0) {
        payments = JSON.parse(paymentsAsString);
    }
    return payments;
};

export const saveSinkingFundPayments = (payments) => {
   localStorage.setItem('sinkingfunds_payments', JSON.stringify(payments));
};


export const saveSinkingFunds = (sinkingfunds) => {
    localStorage.setItem('sinkingfunds', JSON.stringify(sinkingfunds));
};

export const loadSinkingFunds = () => {
    let sinkingfunds = [];
    const sinkingFundsAsString = localStorage.getItem('sinkingfunds');
    if (sinkingFundsAsString && sinkingFundsAsString.length > 0) {
        sinkingfunds = JSON.parse(sinkingFundsAsString);
    }
    return sinkingfunds;
}
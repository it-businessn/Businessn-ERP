export const getAmount = (data) => `$${data ? Math.abs(data)?.toFixed(2) : `0.00`}`;

/** Like getAmount, but keeps the minus sign (getAmount shows -50 as $50.00). */
export const getSignedAmount = (data) => `${Number(data) < 0 ? "-" : ""}${getAmount(data)}`;

export const convertDecimal = (data) => (data && data !== "" ? parseFloat(data)?.toFixed(2) : 0.0);

export const roundUpNumber = (num) => Number(num).toFixed(2);

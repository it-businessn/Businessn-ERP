export const getAmount = (data) => `$${data ? Math.abs(data)?.toFixed(2) : `0.00`}`;

export const convertDecimal = (data) => (data && data !== "" ? parseFloat(data)?.toFixed(2) : 0.0);

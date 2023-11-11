export const userCurrency = (currency) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    });

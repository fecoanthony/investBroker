export const formatCurrency = (cents) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

export const formatRateUnit = (unit) => {
  switch (unit) {
    case "hour":
      return "Every Hour";
    case "day":
      return "Every Day";
    case "week":
      return "Every Week";
    case "month":
      return "Every Month";
    case "lifetime":
      return "Lifetime";
    default:
      return "";
  }
};

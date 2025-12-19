import api from "../../utils/api";

/**
 * Get all transactions (admin)
 */
export const fetchAdminTransactions = async (params = {}) => {
  const res = await api.get("/admin/transactions/list-transactions", {
    params,
  });
  return res.data.data;
};

/**
 * Approve or reject withdrawal
 */
export const processWithdrawal = async ({ transactionId, action }) => {
  const res = await api.post("/admin/transactions/withdraw/process", {
    transactionId,
    action, // "approve" | "reject"
  });
  return res.data;
};

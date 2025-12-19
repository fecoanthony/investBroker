// import React, { useEffect } from "react";
// import { useTransactionStore } from "../../stores/useTransactionStore";
// import TransactionTable from "../../components/admin/TransactionTable";
// import LoadingSpinner from "../../components/LoadingSpinner";

// const AdminTransactions = () => {
//   const { fetchAdminTransactions, transactions, loading } =
//     useTransactionStore();

//   useEffect(() => {
//     fetchAdminTransactions();
//   }, [fetchAdminTransactions]);

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Transaction Management</h1>
//       <TransactionTable transactions={transactions} />
//     </div>
//   );
// };

// export default AdminTransactions;

import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  fetchAdminTransactions,
  processWithdrawal,
} from "../../services/admin/transactionService";
import TransactionRow from "../../components/admin/TransactionRow";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTransactions({
        type: "withdraw",
      });
      setTransactions(data.transactions);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleAction = async (transactionId, action) => {
    if (!window.confirm(`Confirm ${action} withdrawal?`)) return;

    try {
      await processWithdrawal({ transactionId, action });
      await loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Withdrawal Transactions</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow key={tx._id} tx={tx} onAction={handleAction} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTransactions;

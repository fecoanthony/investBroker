import React from "react";
import { useTransactionStore } from "../../stores/useTransactionStore";

const formatMoney = (cents) => `$${(cents / 100).toLocaleString()}`;

const TransactionTable = ({ transactions }) => {
  const { processWithdrawal } = useTransactionStore();

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">User</th>
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t border-slate-700">
              <td className="p-3">{tx.userId}</td>
              <td className="p-3 text-center">{tx.type}</td>
              <td className="p-3 text-center">{formatMoney(tx.amountCents)}</td>
              <td className="p-3 text-center">{tx.status}</td>
              <td className="p-3 text-center">
                {tx.type === "withdraw" && tx.status === "pending" && (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => processWithdrawal(tx._id, "complete")}
                      className="px-3 py-1 bg-green-600 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => processWithdrawal(tx._id, "fail")}
                      className="px-3 py-1 bg-red-600 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await axios.get("/admin/transactions");
    setTransactions(res.data.data);
  };

  const approveWithdrawal = async (id) => {
    await axios.post(`/admin/transactions/approve-withdrawal/${id}`);
    toast.success("Withdrawal approved");
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-b border-gray-800">
              <td>{tx.userId?.email}</td>
              <td>{tx.type}</td>
              <td>${(tx.amountCents / 100).toFixed(2)}</td>
              <td>{tx.status}</td>

              <td>
                {tx.type === "withdraw" && tx.status === "pending" && (
                  <button
                    onClick={() => approveWithdrawal(tx._id)}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTransactionsPage;

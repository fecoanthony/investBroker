import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "../lib/axios"; // use your existing axios instance

const formatMoney = (cents) =>
  `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

const statusBadge = (status) => {
  const map = {
    completed: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-yellow-500/15 text-yellow-400",
    failed: "bg-red-500/15 text-red-400",
    rejected: "bg-red-500/15 text-red-400",
  };
  return map[status] || "bg-slate-500/15 text-slate-400";
};

const typeIcon = (type, amountCents) => {
  if (amountCents > 0)
    return <ArrowDownCircle className="text-emerald-400" size={18} />;
  if (amountCents < 0)
    return <ArrowUpCircle className="text-red-400" size={18} />;
  return <Clock size={18} />;
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/transactions/me?page=${page}&limit=${limit}`
      );
      setTransactions(res.data.data.txs);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">
          Transaction History
        </h2>

        {loading ? (
          <div className="text-slate-400">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-slate-400">No transactions found.</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-slate-800
                           bg-slate-900/60 p-4"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  {typeIcon(tx.type, tx.amountCents)}

                  <div>
                    <div className="text-white font-medium capitalize">
                      {tx.type.replace("_", " ")}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      tx.amountCents > 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {tx.amountCents > 0 ? "+" : ""}
                    {formatMoney(tx.amountCents)}
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusBadge(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-md bg-slate-800 text-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-md bg-slate-800 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionHistory;

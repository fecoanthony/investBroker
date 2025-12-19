import React, { useEffect, useState } from "react";
import axios from "../../lib/axios"; // use your configured axios instance
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/admin/dashboard/summary");
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="p-6">Failed to load dashboard.</div>;

  const { users, investments, recent } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.total} />
        <StatCard title="Active Investments" value={investments.active} />
        <StatCard
          title="Investment Volume"
          value={`$${(investments.volumeCents / 100).toLocaleString()}`}
        />
        <StatCard title="Completed Investments" value={investments.completed} />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions transactions={recent.transactions} />
        <RecentInvestments investments={recent.investments} />
        <RecentUsers users={recent.users} />
      </div>
    </div>
  );
};

export default AdminDashboard;

/* -------------------- SUB COMPONENTS -------------------- */

const StatCard = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const RecentTransactions = ({ transactions }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
    <h2 className="font-semibold mb-4">Recent Transactions</h2>
    <table className="w-full text-sm">
      <thead className="text-slate-400">
        <tr>
          <th className="text-left">User</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id} className="border-t border-slate-800">
            <td>{tx.userId?.email}</td>
            <td className="text-center">{tx.type}</td>
            <td className="text-center">
              ${(tx.amountCents / 100).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RecentInvestments = ({ investments }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
    <h2 className="font-semibold mb-4">Recent Investments</h2>
    <ul className="space-y-3 text-sm">
      {investments.map((inv) => (
        <li key={inv._id} className="border-b border-slate-800 pb-2">
          <p>{inv.userId?.email}</p>
          <p className="text-slate-400">
            {inv.planId?.name} • ${(inv.amountCents / 100).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

const RecentUsers = ({ users }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
    <h2 className="font-semibold mb-4">New Users</h2>
    <ul className="space-y-3 text-sm">
      {users.map((user) => (
        <li key={user._id} className="border-b border-slate-800 pb-2">
          <p>{user.email}</p>
          <p className="text-slate-400">
            {user.role} • {user.active ? "Active" : "Suspended"}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

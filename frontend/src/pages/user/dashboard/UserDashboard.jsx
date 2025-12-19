// import ReferralCard from "./components/ReferralCard";
import { useEffect } from "react";
import { useUserDashboardStore } from "../stores/useUserDashboardStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const StatCard = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-xl font-semibold mt-1">${value}</p>
  </div>
);

const UserDashboard = () => {
  const { summary, loading, error, fetchDashboardSummary } =
    useUserDashboardStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-400 p-6">{error}</p>;
  if (!summary) return null;

  const { balances, totals, referral, kycStatus, recentTransactions } = summary;

  return (
    <div className="p-6 space-y-6">
      {/* KYC ALERT */}
      {kycStatus !== "verified" && (
        <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 rounded-lg p-4 flex items-center justify-between">
          <p>You have information to submit for KYC verification.</p>
          <Link
            to="/kyc"
            className="bg-yellow-600 text-black px-4 py-2 rounded-md text-sm font-semibold"
          >
            Submit
          </Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Main Balance" value={balances.mainBalance} />
        <StatCard title="Interest Balance" value={balances.interestBalance} />
        <StatCard title="Total Deposit" value={totals.totalDeposit} />
        <StatCard title="Total Invest" value={totals.totalInvest} />
        <StatCard title="Total Payout" value={totals.totalPayout} />
        <StatCard title="Referral Bonus" value={totals.referralBonus} />
        <StatCard title="Total Transactions" value={totals.transactionCount} />
        <StatCard title="Total Tickets" value={totals.ticketCount} />
      </div>

      {/* ACTIVE INVESTMENTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="flex justify-between items-center border-b border-slate-800 p-4">
          <h3 className="font-semibold">Active Investments</h3>
          <Link
            to="/investments"
            className="text-sm text-blue-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {summary.activeInvestments?.length === 0 ? (
          <p className="p-6 text-center text-slate-400">
            No active investments
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Next Payout</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.activeInvestments.map((inv) => (
                <tr key={inv._id} className="border-t border-slate-800">
                  <td className="p-3">{inv.planId.name}</td>
                  <td className="p-3">${(inv.amountCents / 100).toFixed(2)}</td>
                  <td className="p-3">
                    {new Date(inv.nextPayoutAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 capitalize">{inv.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* REFERRAL */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-sm text-slate-400 mb-2">Referral URL</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referral.url}
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => navigator.clipboard.writeText(referral.url)}
            className="bg-blue-600 px-4 py-2 rounded text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="border-b border-slate-800 p-4 font-semibold">
          Recent Transactions
        </div>

        {recentTransactions.length === 0 ? (
          <p className="p-6 text-center text-slate-400">No Data Found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-800">
                  <td className="p-3 capitalize">{tx.type}</td>
                  <td className="p-3">${tx.amount.toFixed(2)}</td>
                  <td className="p-3 capitalize">{tx.status}</td>
                  <td className="p-3">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

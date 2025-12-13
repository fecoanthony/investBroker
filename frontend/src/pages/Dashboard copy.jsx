import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ReferralBox from "../components/ReferralBox";
import TransactionsTable from "../components/TransactionsTable";
import axios from "../lib/axios"; // your axios instance (withCredentials)
import { Bell } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [pendingNotice, setPendingNotice] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // fetch dashboard data: replace endpoints with your API
    const load = async () => {
      try {
        const sRes = await axios.get("/dashboard/stats"); // returns { mainBalanceCents, interestBalanceCents, ... }
        setStats(sRes.data.data ?? sRes.data);

        const tx = await axios.get("/transactions/me?limit=8");
        setTransactions(tx.data.data ?? tx.data);

        // Example: check KYC status
        // If API returns user object, check user.kycStatus
        const userRes = await axios.get("/auth/me");
        setPendingNotice(userRes.data.user?.kycStatus === "none");
      } catch (err) {
        console.warn("Dashboard load error", err);
      }
    };
    load();
  }, []);

  // While loading show skeleton (simple)
  if (!stats) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-slate-900 text-white">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-800 rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="h-24 bg-slate-800 rounded" />
              <div className="h-24 bg-slate-800 rounded" />
              <div className="h-24 bg-slate-800 rounded" />
              <div className="h-24 bg-slate-800 rounded" />
            </div>
            <div className="h-64 bg-slate-800 rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              Overview of your account
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="notifications"
              className="p-2 bg-slate-800 rounded-md hover:bg-slate-700"
            >
              <Bell size={18} />
            </button>
            <div className="text-sm text-slate-400">Welcome back</div>
          </div>
        </div>

        {/* KYC Notice */}
        {pendingNotice && (
          <div className="mt-6">
            <div className="rounded-md bg-amber-700/10 border border-amber-400/20 p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-amber-300">
                  You have information to submit for KYC verification.
                </div>
                <div className="text-sm text-slate-400">
                  Complete KYC to unlock withdrawals and higher limits.
                </div>
              </div>
              <div>
                <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* stat cards */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Main Balance"
            value={`$${(stats.mainBalanceCents / 100).toFixed(2)}`}
          />
          <StatCard
            label="Interest Balance"
            value={`$${(stats.interestBalanceCents / 100).toFixed(2)}`}
          />
          <StatCard
            label="Total Deposit"
            value={`$${(stats.totalDepositCents / 100).toFixed(2)}`}
          />
          <StatCard
            label="Total Invest"
            value={`$${(stats.totalInvestCents / 100).toFixed(2)}`}
          />
        </section>

        {/* referral + transactions row */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReferralBox referralUrl={stats.referralUrl || ""} />
            <div className="mt-6">
              <TransactionsTable items={transactions} />
            </div>
          </div>

          {/* Right column - quick actions or summary */}
          <aside className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400">Quick Actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <button className="w-full px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
                  Create Deposit
                </button>
                <button className="w-full px-3 py-2 bg-slate-800 rounded hover:bg-slate-700">
                  Request Payout
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400">Referral Summary</div>
              <div className="mt-3">
                <div className="text-lg font-medium">
                  ${(stats.totalReferralBonusCents / 100).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400">
                  Total referral bonus
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

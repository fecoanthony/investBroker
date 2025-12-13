import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ReferralBox from "../components/ReferralBox";
import TransactionsTable from "../components/TransactionsTable";
import CreateDepositModal from "../components/CreateDepositModal"; // new file
import toast from "react-hot-toast";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 Expected route names (from your list):
 - GET  /me                      -> getCurrentUser
 - GET  /get-wallet              -> getWallet
 - GET  /list-investment         -> listUserInvestments
 - GET  /transactions/list-transactions?limit=8 -> list transactions
 - GET  /referral/me             -> listReferralsForUser (contains referral url + totals)
 - POST /transactions/create-crypto-deposit -> create deposit (not used here)
 - POST /transactions/deposit   -> (admin/manual deposit, not used)
 */

export default function Dashboard() {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [referral, setReferral] = useState(null);
  const [stats, setStats] = useState({
    mainBalanceCents: 0,
    interestBalanceCents: 0,
    totalDepositCents: 0,
    totalInvestCents: 0,
    totalPayoutCents: 0,
    totalReferralBonusCents: 0,
    totalTransactionCents: 0,
    totalTicket: 0,
  });

  const navigate = useNavigate();
  const [referralUrl, setReferralUrl] = useState("");

  useEffect(() => {
    let mounted = true;

    // FIX: You must declare controller inside the effect
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);

      try {
        // 1) Check authentication first
        const meRes = await axios.get("/me", { signal: controller.signal });
        if (!mounted) return;

        const userObj = meRes.data.user ?? meRes.data;
        setUser(userObj);

        // 2) Prepare secondary requests
        const requests = [
          axios.get("/get-wallet", { signal: controller.signal }),
          axios.get("/list-investment", { signal: controller.signal }),
          axios.get("/referral/me", { signal: controller.signal }),
        ];

        // Admin only
        const willRequestTransactions = userObj?.role === "admin";
        if (willRequestTransactions) {
          requests.push(
            axios.get("/transactions/list-transactions?limit=8", {
              signal: controller.signal,
            })
          );
        }

        // 3) Fetch all, even if one fails
        const settled = await Promise.allSettled(requests);
        if (!mounted) return;

        const unwrap = (item) => {
          if (!item) return null;
          if (item.status === "fulfilled") {
            return item.value.data.data ?? item.value.data ?? null;
          }
          console.warn("Dashboard sub-request failed:", item.reason);
          return null;
        };

        const walletSettled = settled[0];
        const investSettled = settled[1];
        const refSettled = settled[2];
        const txSettled = willRequestTransactions ? settled[3] : null;

        const w = unwrap(walletSettled);
        const invRaw = unwrap(investSettled) ?? [];
        const refRaw = unwrap(refSettled);

        let txs = [];
        if (txSettled?.status === "fulfilled") {
          const txRaw = txSettled.value.data.data ?? txSettled.value.data;
          txs = Array.isArray(txRaw) ? txRaw : txRaw?.txs ?? [];
        }

        // 4) Set states
        setWallet(w);
        setInvestments(Array.isArray(invRaw) ? invRaw : []);
        setTransactions(txs);
        setReferral(refRaw);
        setReferralUrl(
          refRaw?.referralUrl ?? refRaw?.url ?? userObj?.referralUrl ?? ""
        );

        // 5) Compute stats
        const totalDepositCents =
          w?.totalDepositsCents != null
            ? Number(w.totalDepositsCents)
            : txs.reduce(
                (s, t) =>
                  t.type === "deposit" ? s + Number(t.amountCents || 0) : s,
                0
              );

        const totalInvestCents = invRaw.reduce(
          (s, it) => s + Number(it.amountCents || 0),
          0
        );

        const totalPayoutCents = txs.reduce(
          (s, t) => (t.type === "payout" ? s + Number(t.amountCents || 0) : s),
          0
        );

        const totalTransactionCents = txs.reduce(
          (s, t) => s + Math.abs(Number(t.amountCents || 0)),
          0
        );

        const totalReferralBonusCents = Number(
          refRaw?.totalReferralBonusCents ?? refRaw?.totalBonusCents ?? 0
        );

        setStats({
          mainBalanceCents: Number(w?.mainBalanceCents || 0),
          interestBalanceCents: Number(w?.interestBalanceCents || 0),
          totalDepositCents,
          totalInvestCents,
          totalPayoutCents,
          totalReferralBonusCents,
          totalTransactionCents,
          totalTicket: Number(refRaw?.ticketCount ?? 0),
        });
      } catch (err) {
        if (err?.name === "CanceledError") return;

        console.error("Dashboard load error:", err);

        const status = err?.response?.status;
        if (status === 401) {
          navigate("/login");
          return;
        }
        if (status === 403) {
          toast.error("You do not have permission to access this resource.");
        } else {
          toast.error("Failed to load dashboard.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [navigate]);

  // small helper - optional if you have transactions grouped server-side
  function transactionsSumByType(list = [], type = "deposit") {
    return (list || []).reduce(
      (s, it) => s + (it.type === type ? Number(it.amountCents || 0) : 0),
      0
    );
  }

  const handleDepositCreated = (tx) => {
    // prepend the newly created transaction to the transactions array
    setTransactions((prev) => [tx, ...(prev || [])]);

    // optionally update wallet balances, or re-fetch wallet
    // setWallet(prev => ({ ...prev, mainBalanceCents: Number(prev.mainBalanceCents) + Number(tx.amountCents) }));

    toast.success("Deposit request created — awaiting admin confirmation");
  };

  // currency formatter
  const fmt = (cents) => {
    const n = Number(cents || 0) / 100;
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  };

  if (loading) {
    // skeleton while loading
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-slate-950 text-white">
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
    <div className="flex min-h-screen bg-slate-950 text-white mt-20">
      <Sidebar />
      <main className="flex-1 p-6">
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
            <div className="text-sm text-slate-400">{user?.name}</div>
          </div>
        </div>

        {user?.kycStatus === "none" && (
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

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Main Balance" value={fmt(stats.mainBalanceCents)} />
          <StatCard
            label="Interest Balance"
            value={fmt(stats.interestBalanceCents)}
          />
          <StatCard
            label="Total Deposit"
            value={fmt(stats.totalDepositCents)}
          />
          <StatCard label="Total Invest" value={fmt(stats.totalInvestCents)} />
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReferralBox
              referralUrl={referral?.referralUrl ?? referral?.url ?? ""}
            />
            <div className="mt-6">
              <TransactionsTable items={transactions} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-sm text-slate-400">Quick Actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="w-full px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
                >
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
                  {fmt(stats.totalReferralBonusCents)}
                </div>
                <div className="text-xs text-slate-400">
                  Total referral bonus
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <CreateDepositModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={(tx) => handleDepositCreated(tx)}
      />
    </div>
  );
}

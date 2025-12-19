// components/WalletOverview.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useWalletStore } from "../stores/useWalletStore";
import LoadingSpinner from "./LoadingSpinner";
import { formatMoney } from "../utils/formatMoney";

const WalletOverview = () => {
  const { wallets, fetchWallet, loading } = useWalletStore();

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (loading) return <LoadingSpinner />;

  if (!wallets.length) {
    return <p className="text-slate-400 text-center">No wallet found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {wallets.map((wallet) => (
        <motion.div
          key={wallet._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h3 className="text-yellow-400 font-semibold mb-4">
            Wallet ({wallet.currency})
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Available Balance</span>
              <span className="text-white">
                {formatMoney(wallet.mainBalanceCents)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Interest Earned</span>
              <span className="text-emerald-400">
                {formatMoney(wallet.interestBalanceCents)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Locked in Investments</span>
              <span className="text-orange-400">
                {formatMoney(wallet.reservedCents)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WalletOverview;

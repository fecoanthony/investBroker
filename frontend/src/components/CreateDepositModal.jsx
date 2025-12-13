import React, { useState } from "react";
import axios from "../lib/axios";
import { X } from "lucide-react";

/**
 * Props:
 *  - open (bool)
 *  - onClose (fn)
 *  - onSuccess(tx) -> called with created transaction object
 *
 * This component handles:
 *  - amount (required)
 *  - optional txHash or note string (useful when user paste blockchain tx)
 *  - optional file proof (image) upload (multipart/form-data)
 *
 * Server behavior expected:
 *  POST /transactions/create-crypto-deposit
 *    body: { amount: number, note?: string, txHash?: string }
 *    or multipart/form-data with 'proof' file
 *
 * Response expected: created transaction object in res.data.transaction or res.data
 */

export default function CreateDepositModal({ open, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [note, setNote] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const resetForm = () => {
    setAmount("");
    setTxHash("");
    setNote("");
    setProofFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      // If file present, send multipart/form-data
      let res;
      if (proofFile) {
        const fd = new FormData();
        fd.append("amount", amt);
        if (txHash) fd.append("txHash", txHash);
        if (note) fd.append("note", note);
        fd.append("proof", proofFile);
        res = await axios.post("/transactions/create-crypto-deposit", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // JSON body path
        res = await axios.post("/transactions/create-crypto-deposit", {
          amount: amt,
          txHash: txHash || undefined,
          note: note || undefined,
        });
      }

      const tx = res.data.transaction ?? res.data;
      // call parent callback to insert tx into UI
      if (onSuccess) onSuccess(tx);

      // success: close modal and reset
      resetForm();
      onClose();
    } catch (err) {
      console.error("Create deposit error", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create deposit. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          if (!loading) {
            resetForm();
            onClose();
          }
        }}
      />
      <div className="relative w-full max-w-md bg-slate-900 rounded-lg border border-slate-800 p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Crypto Deposit</h3>
          <button
            aria-label="close modal"
            onClick={() => {
              if (!loading) {
                resetForm();
                onClose();
              }
            }}
            className="p-1 rounded hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-300 bg-red-900/10 p-2 rounded">
              {error}
            </div>
          )}

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Amount (USD)</div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 100.00"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">
              Transaction hash (optional)
            </div>
            <input
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste blockchain tx hash (if available)"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
            />
          </label>

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Note (optional)</div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any note for admin"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:outline-none"
            />
          </label>

          <label className="block">
            <div className="text-sm text-slate-300 mb-1">
              Upload proof (optional)
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-300"
            />
            <div className="text-xs text-slate-500 mt-1">
              Optional: screenshot or tx receipt
            </div>
          </label>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (!loading) {
                  resetForm();
                  onClose();
                }
              }}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

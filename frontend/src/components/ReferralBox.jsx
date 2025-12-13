import React, { useState } from "react";

export default function ReferralBox({ referralUrl }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy referral URL:", err);
    }
  };

  return (
    <div className="mt-6 bg-slate-900 border border-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-slate-300">Referral URL</h3>

      <div className="mt-3 flex items-center justify-between bg-slate-800 py-2 px-3 rounded-md">
        <span className="truncate">{referralUrl}</span>

        <button
          onClick={copy}
          className="ml-4 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm flex items-center gap-1"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

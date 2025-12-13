import React from "react";

export default function StatCard({ label, value }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

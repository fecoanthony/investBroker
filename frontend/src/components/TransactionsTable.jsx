import React from "react";

export default function TransactionsTable({ items = [] }) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-slate-200 font-medium">
          Recent Transactions
        </h3>
        <div className="text-xs text-slate-400">Latest 8</div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400 text-xs uppercase">
            <tr>
              <th className="py-2">Type</th>
              <th className="py-2">TXID / Note</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No Data Found
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id} className="border-t border-slate-800">
                  <td className="py-3">{it.type}</td>
                  <td className="py-3 text-xs text-slate-300 break-all">
                    {it.providerTxId || it.meta?.txHash || it._id}
                  </td>
                  <td className="py-3">
                    ${((it.amountCents || 0) / 100).toFixed(2)}
                  </td>
                  <td className="py-3 text-xs text-slate-400">
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        it.status === "completed"
                          ? "bg-green-600 text-black"
                          : it.status === "pending"
                          ? "bg-amber-500 text-black"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

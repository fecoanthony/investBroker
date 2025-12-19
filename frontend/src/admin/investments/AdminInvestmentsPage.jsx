import { useEffect, useState } from "react";
import {
  fetchAdminInvestments,
  toggleInvestment,
  forceCancelInvestment,
} from "../services/adminInvestmentService";
import toast from "react-hot-toast";

const AdminInvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminInvestments();
      setInvestments(data.investments);
    } catch (err) {
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const handleToggle = async (investmentId, action) => {
    // optimistic update
    setInvestments((prev) =>
      prev.map((inv) =>
        inv._id === investmentId
          ? { ...inv, state: action === "pause" ? "paused" : "active" }
          : inv
      )
    );

    try {
      await toggleInvestment({ investmentId, action });
      toast.success(`Investment ${action}d`);
    } catch (err) {
      toast.error("Action failed");
      loadInvestments(); // rollback
    }
  };

  const handleForceCancel = async (investmentId) => {
    if (!confirm("Force cancel this investment? This cannot be undone.")) {
      return;
    }

    try {
      await forceCancelInvestment(investmentId);
      toast.success("Investment cancelled");

      setInvestments((prev) =>
        prev.map((inv) =>
          inv._id === investmentId ? { ...inv, state: "cancelled" } : inv
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Not authorized");
    }
  };

  if (loading) return <p>Loading investments...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Investments</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th>User</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id} className="border-b border-slate-800">
                <td>{inv.userId?.email}</td>
                <td>{inv.planId?.name}</td>
                <td>${(inv.amountCents / 100).toFixed(2)}</td>
                <td className="capitalize">{inv.state}</td>

                <td className="flex gap-2 py-2">
                  {inv.state === "active" && (
                    <button
                      onClick={() => handleToggle(inv._id, "pause")}
                      className="px-3 py-1 bg-yellow-600 rounded"
                    >
                      Pause
                    </button>
                  )}

                  {inv.state === "paused" && (
                    <button
                      onClick={() => handleToggle(inv._id, "resume")}
                      className="px-3 py-1 bg-green-600 rounded"
                    >
                      Resume
                    </button>
                  )}

                  {inv.state !== "completed" && (
                    <button
                      onClick={() => handleForceCancel(inv._id)}
                      className="px-3 py-1 bg-red-700 rounded"
                    >
                      Force Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInvestmentsPage;

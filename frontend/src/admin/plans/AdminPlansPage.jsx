import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CreatePlanModal from "./CreatePlanModal";
import EditPlanModal from "./EditPlanModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminApi } from "../../services/adminApi";

const AdminPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await adminApi.get("/plans");
    setPlans(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (data) => {
    setCreating(true);
    await adminApi.post("/plans", data);
    setCreating(false);
    fetchPlans();
  };

  const handleUpdate = async (id, data) => {
    setUpdating(true);
    await adminApi.put(`/plans/${id}`, data);
    setUpdating(false);
    setEditingPlan(null);
    fetchPlans();
  };

  const togglePlan = async (id) => {
    await adminApi.patch(`/plans/${id}/toggle`);
    fetchPlans();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Investment Plans</h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          + Create Plan
        </button>
      </div>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-slate-900 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{plan.name}</h3>
              <p className="text-sm text-slate-400">
                Rate: {plan.rate}% | Range: ${plan.minAmountCents / 100} – $
                {plan.maxAmountCents / 100}
              </p>
              <p className="text-xs mt-1">
                Investments: {plan.investmentCount}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => togglePlan(plan._id)}
                className={`px-3 py-1 rounded text-sm ${
                  plan.active ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                {plan.active ? "Active" : "Inactive"}
              </button>

              <button
                disabled={plan.investmentCount > 0}
                onClick={() => setEditingPlan(plan)}
                className="px-3 py-1 rounded bg-blue-600 disabled:opacity-40"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreatePlanModal
        isOpen={creating}
        onClose={() => setCreating(false)}
        onCreate={handleCreate}
        loading={creating}
      />

      <EditPlanModal
        isOpen={!!editingPlan}
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onUpdate={(data) => handleUpdate(editingPlan._id, data)}
        loading={updating}
      />
    </motion.div>
  );
};

export default AdminPlansPage;

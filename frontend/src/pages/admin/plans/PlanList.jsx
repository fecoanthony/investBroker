import { useEffect, useState } from "react";
import { getPlans, togglePlanStatus } from "./planService";
import EditPlanModal from "./EditPlanModal";
import CreatePlanModal from "./CreatePlanModal";

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPlans = async () => {
    const res = await getPlans();
    setPlans(res.data.data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Investment Plans</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          Create Plan
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Rate</th>
            <th>Status</th>
            <th>Locked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan._id} className="border-t">
              <td>{plan.name}</td>
              <td>
                {plan.rate}% / {plan.rateUnit}
              </td>
              <td>{plan.active ? "Active" : "Inactive"}</td>
              <td>{plan.isLocked ? "Yes" : "No"}</td>
              <td className="space-x-2">
                <button
                  disabled={plan.isLocked}
                  onClick={() => setEditingPlan(plan)}
                  className={`btn-sm ${
                    plan.isLocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Edit
                </button>

                <button
                  onClick={() => togglePlanStatus(plan._id)}
                  className="btn-sm"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSuccess={fetchPlans}
        />
      )}

      {showCreate && (
        <CreatePlanModal
          onClose={() => setShowCreate(false)}
          onSuccess={fetchPlans}
        />
      )}
    </div>
  );
}

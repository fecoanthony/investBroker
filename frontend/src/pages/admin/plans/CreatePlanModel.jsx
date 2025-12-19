import React, { useState } from "react";
import PlanForm from "./PlanForm";
import { createPlan } from "./planService";

const CreatePlanModal = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const newPlan = await createPlan(formData);

      onCreated?.(newPlan); // refresh list
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create Investment Plan</h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-3">
            {error}
          </div>
        )}

        <PlanForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Plan"
        />

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatePlanModal;

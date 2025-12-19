import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanForm from "./PlanForm";

const EditPlanModal = ({ isOpen, onClose, plan, onUpdate, loading }) => {
  if (!isOpen || !plan) return null;

  const hasInvestments = plan.investmentCount > 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-slate-900 rounded-lg w-full max-w-xl p-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Edit Investment Plan</h2>
            <button onClick={onClose}>✕</button>
          </div>

          {hasInvestments ? (
            <div className="bg-red-900/40 p-4 rounded text-sm">
              This plan already has active investments and
              <strong> cannot be edited</strong>.
            </div>
          ) : (
            <PlanForm
              initialData={plan}
              onSubmit={onUpdate}
              loading={loading}
              submitLabel="Update Plan"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditPlanModal;

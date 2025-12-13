import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const PlanCard = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -8, scale: plan.featured ? 1.02 : 1 }}
      className={`relative rounded-2xl border p-6 bg-linear-to-b from-slate-900/60 to-slate-950
        ${
          plan.featured
            ? "border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.15)]"
            : "border-slate-800"
        }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-yellow-400">{plan.name}</h3>
        <p className="text-sm text-slate-400">{plan.tagline}</p>
      </div>

      {/* Return */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-white">{plan.returnRate}</div>
        <span className="text-sm text-slate-400">Return</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 text-sm mb-6">
        <li className="flex justify-between">
          <span className="text-slate-400">Profit</span>
          <span className="text-white">{plan.profit}</span>
        </li>

        <li className="flex justify-between items-center">
          <span className="text-slate-400">Capital will back</span>
          {plan.capitalBack ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle size={16} /> Yes
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle size={16} /> No
            </span>
          )}
        </li>

        <li className="flex justify-between">
          <span className="text-slate-400">Repeatable</span>
          <span className="text-white">{plan.repeat}</span>
        </li>
      </ul>

      {/* Range */}
      <div className="text-center text-yellow-400 font-medium mb-6">
        {plan.range}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="w-full rounded-md bg-yellow-500 hover:bg-yellow-400 text-slate-900 py-3 font-semibold"
      >
        Invest Now
      </motion.button>
    </motion.div>
  );
};

export default PlanCard;

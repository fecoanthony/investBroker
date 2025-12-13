import React from "react";
import PlanCard from "./PlanCard";
import { plans } from "../data/plans";

const PricingPlans = () => {
  return (
    <section className="py-24 bg-linear-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-400 uppercase tracking-widest text-sm">
            Pricing Plan
          </span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Best Investment Packages
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Select from our trusted investment options to build lasting wealth.
            For tailored investment needs, contact support.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;

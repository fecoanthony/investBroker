import React, { useState, useEffect } from "react";

const defaultForm = {
  name: "",
  slug: "",
  description: "",
  rate: "",
  rateUnit: "day",
  periodCount: 1,
  payoutFrequencySeconds: "",
  minAmountCents: "",
  maxAmountCents: "",
  capitalBack: true,
  autoRenew: false,
  active: true,
};

const PlanForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitLabel = "Save",
}) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        rate: initialData.rate ?? "",
        minAmountCents: initialData.minAmountCents ?? "",
        maxAmountCents: initialData.maxAmountCents ?? "",
        payoutFrequencySeconds: initialData.payoutFrequencySeconds ?? "",
      });
    }
  }, [initialData]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rate: Number(form.rate),
      periodCount: Number(form.periodCount),
      payoutFrequencySeconds: Number(form.payoutFrequencySeconds),
      minAmountCents: Number(form.minAmountCents),
      maxAmountCents: Number(form.maxAmountCents),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <input
        required
        placeholder="Plan name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        className="w-full p-2 rounded bg-slate-800"
      />

      {/* Slug */}
      <input
        required
        placeholder="Slug (unique)"
        value={form.slug}
        onChange={(e) => update("slug", e.target.value)}
        className="w-full p-2 rounded bg-slate-800"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        className="w-full p-2 rounded bg-slate-800"
      />

      {/* Rate */}
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="number"
          step="0.01"
          placeholder="Rate (%)"
          value={form.rate}
          onChange={(e) => update("rate", e.target.value)}
          className="p-2 rounded bg-slate-800"
        />

        <select
          value={form.rateUnit}
          onChange={(e) => update("rateUnit", e.target.value)}
          className="p-2 rounded bg-slate-800"
        >
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      {/* Period & Frequency */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="1"
          placeholder="Payout periods"
          value={form.periodCount}
          onChange={(e) => update("periodCount", e.target.value)}
          className="p-2 rounded bg-slate-800"
        />

        <input
          type="number"
          placeholder="Payout frequency (seconds)"
          value={form.payoutFrequencySeconds}
          onChange={(e) => update("payoutFrequencySeconds", e.target.value)}
          className="p-2 rounded bg-slate-800"
        />
      </div>

      {/* Amount limits */}
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="number"
          placeholder="Min amount (cents)"
          value={form.minAmountCents}
          onChange={(e) => update("minAmountCents", e.target.value)}
          className="p-2 rounded bg-slate-800"
        />

        <input
          type="number"
          placeholder="Max amount (cents)"
          value={form.maxAmountCents}
          onChange={(e) => update("maxAmountCents", e.target.value)}
          className="p-2 rounded bg-slate-800"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-4 text-sm">
        <label>
          <input
            type="checkbox"
            checked={form.capitalBack}
            onChange={(e) => update("capitalBack", e.target.checked)}
          />{" "}
          Capital Back
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.autoRenew}
            onChange={(e) => update("autoRenew", e.target.checked)}
          />{" "}
          Auto Renew
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />{" "}
          Active
        </label>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full bg-indigo-600 py-2 rounded font-semibold disabled:opacity-60"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default PlanForm;

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
};

export default StatCard;

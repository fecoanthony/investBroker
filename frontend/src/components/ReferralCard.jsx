const ReferralCard = () => {
  const referralUrl = "https://yourapp.com/ref/12345";

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded">
      <p className="text-sm text-slate-400 mb-2">Referral URL</p>
      <div className="flex gap-2">
        <input
          value={referralUrl}
          readOnly
          className="flex-1 bg-slate-800 p-2 rounded text-sm"
        />
        <button
          onClick={() => navigator.clipboard.writeText(referralUrl)}
          className="bg-blue-600 px-3 rounded"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default ReferralCard;

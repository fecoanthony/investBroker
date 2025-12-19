// import { useEffect } from "react";
// import { useTransactionStore } from "../stores/useTransactionStore";

// const Transactions = () => {
//   const { transactions, fetchMyTransactions, loading } = useTransactionStore();

//   useEffect(() => {
//     fetchMyTransactions();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

//       {loading && <p>Loading...</p>}

//       <div className="space-y-3">
//         {transactions.map((tx) => (
//           <div
//             key={tx._id}
//             className="border rounded-lg p-4 flex justify-between"
//           >
//             <div>
//               <p className="font-medium capitalize">{tx.type}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(tx.createdAt).toLocaleString()}
//               </p>
//             </div>

//             <div className="text-right">
//               <p
//                 className={
//                   tx.amountCents < 0 ? "text-red-600" : "text-green-600"
//                 }
//               >
//                 {(tx.amountCents / 100).toFixed(2)} {tx.currency}
//               </p>
//               <p className="text-sm">{tx.status}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Transactions;

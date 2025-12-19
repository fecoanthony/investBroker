import { Button } from "../../ui/Button";

const TransactionRow = ({ tx, onAction }) => {
  const isPending = tx.status === "pending";
  const isWithdraw = tx.type === "withdraw";

  return (
    <tr className="border-b">
      <td>{tx._id}</td>
      <td>{tx.userId?.email || "—"}</td>
      <td>{tx.type}</td>
      <td>${(tx.amountCents / 100).toFixed(2)}</td>
      <td>{tx.status}</td>
      <td>
        {isWithdraw && isPending ? (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction(tx._id, "approve")}
              variant="success"
            >
              Approve
            </Button>
            <Button onClick={() => onAction(tx._id, "reject")} variant="danger">
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;

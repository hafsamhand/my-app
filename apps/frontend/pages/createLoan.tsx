/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
export default function LoanCreate(props: any) {
  const formData = props.formData;
	return (
    <>
      <form onSubmit={props.handleCreateLoan} className="mb-6 p-4 bg-gray-100 rounded">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Loaner ID"
            value={formData.loanerId}
            onChange={(e) => props.setFormData({ ...formData, loanerId: Number(e.target.value) })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Borrower ID"
            value={formData.borrowerId}
            onChange={(e) => props.setFormData({ ...formData, borrowerId: Number(e.target.value) })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            step="0.01"
            value={formData.amount}
            onChange={(e) => props.setFormData({ ...formData, amount: Number(e.target.value) })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Currency Code"
            value={formData.currencyCode}
            onChange={(e) => props.setFormData({ ...formData, currencyCode: e.target.value })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="date"
            value={formData.borrowingDate}
            onChange={(e) => props.setFormData({ ...formData, borrowingDate: e.target.value })}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => props.setFormData({ ...formData, dueDate: e.target.value })}
            className="px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Loan
        </button>
      </form>
    </>
  );
}

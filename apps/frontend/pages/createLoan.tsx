/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoanCreate(props: any) {
  const formData = props.formData;
  return (
    <>
      <div className="mb-6 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Loan</h2>
        <form onSubmit={props.handleCreateLoan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrower <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.borrowerId || ''}
                onChange={(e) =>
                  props.setFormData({ ...formData, borrowerId: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select a borrower</option>
                {props.users
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .filter((u: any) => u.id !== props.user?.id)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.fullname || u.username || u.email} ({u.email})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                You are the loaner (lending money to the selected borrower)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => props.setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input
                type="text"
                value={formData.currencyCode}
                onChange={(e) => props.setFormData({ ...formData, currencyCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrowing Date</label>
              <input
                type="date"
                value={formData.borrowingDate}
                onChange={(e) => props.setFormData({ ...formData, borrowingDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => props.setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Create Loan
          </button>
        </form>
      </div>
    </>
  );
}

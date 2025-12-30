/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CreateSaving(props: any) {
  const { formData, setFormData, handleCreateSaving } = props;
  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Saving</h2>
      <form onSubmit={handleCreateSaving} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              type="text"
              value={formData.currencyCode}
              onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saving Date</label>
            <input
              type="date"
              value={formData.savingDate}
              onChange={(e) => setFormData({ ...formData, savingDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saving Place</label>
            <input
              type="text"
              placeholder="Where is this saved?"
              value={formData.savingPlace}
              onChange={(e) => setFormData({ ...formData, savingPlace: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <input
              type="text"
              placeholder="Why are you saving this?"
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Create Saving
        </button>
      </form>
    </div>
  );
}

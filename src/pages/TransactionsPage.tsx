import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../api/client';
import type { Transaction, PaginatedResponse } from '../types';

const TransactionsPage = () => {
  const [data, setData] = useState<PaginatedResponse<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, page_size: 10 };
      if (typeFilter) params.transaction_type = typeFilter;

      const result = await getTransactions(params);
      console.log('Transactions fetched:', result);
      setData(result);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      const errorMessage = (err as { response?: { data?: { detail?: string } }; message?: string }).response?.data?.detail 
        || (err as Error).message 
        || 'Failed to fetch transactions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center text-lg text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Transactions</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Transactions</h1>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Transaction Type Filter
          </label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="Sale">Sale</option>
            <option value="Payment">Payment</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : data && data.results.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoice Reference</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.results.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700">{transaction.id}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.transaction_type === 'Sale'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">${transaction.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        {transaction.invoice_reference ? (
                          <span className="text-slate-900 font-medium">
                            {transaction.invoice_reference}
                          </span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(transaction.transaction_date).toLocaleDateString()} at{' '}
                        {new Date(transaction.transaction_date).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                Showing {data.results.length} of {data.count} transactions
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!data.previous}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-slate-700">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!data.next}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-10 text-center">
            <p className="text-slate-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;

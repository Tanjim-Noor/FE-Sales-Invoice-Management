import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../api/client';
import type { Transaction, PaginatedResponse } from '../types';

const TransactionsPage = () => {
  const [data, setData] = useState<PaginatedResponse<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: 10 };
      if (typeFilter) params.transaction_type = typeFilter;

      const result = await getTransactions(params);
      setData(result);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      alert('Error fetching transactions: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, typeFilter]);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Transactions</h1>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type Filter
          </label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="Sale">Sale</option>
            <option value="Payment">Payment</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : data && data.results.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice Reference</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            transaction.transaction_type === 'Sale'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">${transaction.amount}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => navigate(`/invoices/${transaction.invoice.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {transaction.invoice.reference_number}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(transaction.transaction_date).toLocaleDateString()} at{' '}
                        {new Date(transaction.transaction_date).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing {data.results.length} of {data.count} transactions
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!data.previous}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!data.next}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;

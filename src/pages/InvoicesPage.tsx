import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInvoices, deleteInvoice, payInvoice } from '../api/client';
import type { Invoice, PaginatedResponse } from '../types';

const InvoicesPage = () => {
  const [data, setData] = useState<PaginatedResponse<Invoice> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params: any = { page, page_size: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const result = await getInvoices(params);
      setData(result);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      alert('Error fetching invoices: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, search, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await deleteInvoice(id);
      alert('Invoice deleted successfully');
      fetchInvoices();
    } catch (error: any) {
      alert('Error deleting invoice: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handlePay = async (id: number) => {
    try {
      await payInvoice(id);
      alert('Invoice marked as paid');
      fetchInvoices();
    } catch (error: any) {
      alert('Error paying invoice: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading && !data) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center text-lg text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
        <Link
          to="/invoices/create"
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          + Create Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search (Reference/Customer)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Search invoices..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.results.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{invoice.reference_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{invoice.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{invoice.customer_email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">${invoice.total_amount}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            className="text-slate-900 hover:text-slate-700 font-medium transition-colors"
                          >
                            View
                          </button>
                          {invoice.status === 'Pending' && (
                            <button
                              onClick={() => handlePay(invoice.id)}
                              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                            >
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                Showing {data.results.length} of {data.count} invoices
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
            <p className="text-slate-500 mb-5">No invoices found</p>
            <Link
              to="/invoices/create"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create your first invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;

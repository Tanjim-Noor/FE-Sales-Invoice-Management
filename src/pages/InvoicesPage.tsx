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
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <Link
          to="/invoices/create"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search (Reference/Customer)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Search invoices..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reference</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{invoice.reference_number}</td>
                      <td className="px-4 py-3 text-sm">{invoice.customer_name}</td>
                      <td className="px-4 py-3 text-sm">{invoice.customer_email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            invoice.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">${invoice.total_amount}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                          {invoice.status === 'Pending' && (
                            <button
                              onClick={() => handlePay(invoice.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
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
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing {data.results.length} of {data.count} invoices
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
            <p className="text-gray-600 mb-4">No invoices found</p>
            <Link
              to="/invoices/create"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

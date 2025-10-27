import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice, payInvoice, deleteInvoice } from '../api/client';
import type { Invoice } from '../types';

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoice(Number(id));
        setInvoice(data);
      } catch (error: any) {
        alert('Error fetching invoice: ' + (error.response?.data?.detail || error.message));
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id, navigate]);

  const handlePay = async () => {
    if (!invoice) return;

    try {
      const updated = await payInvoice(invoice.id);
      setInvoice(updated);
      alert('Invoice marked as paid successfully!');
    } catch (error: any) {
      alert('Error paying invoice: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;

    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await deleteInvoice(invoice.id);
      alert('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error: any) {
      alert('Error deleting invoice: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoice Details</h1>
          <span
            className={`px-4 py-2 rounded-lg text-lg font-semibold ${
              invoice.status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Invoice Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Invoice Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Reference Number:</span>
                  <p className="font-semibold">{invoice.reference_number}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Created Date:</span>
                  <p className="font-semibold">
                    {new Date(invoice.created_at).toLocaleDateString()} at{' '}
                    {new Date(invoice.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <p className="font-semibold">
                    {new Date(invoice.updated_at).toLocaleDateString()} at{' '}
                    {new Date(invoice.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-semibold">{invoice.customer_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-semibold">{invoice.customer_email}</p>
                </div>
                {invoice.customer_phone && (
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-semibold">{invoice.customer_phone}</p>
                  </div>
                )}
                {invoice.customer_address && (
                  <div>
                    <span className="text-sm text-gray-600">Address:</span>
                    <p className="font-semibold">{invoice.customer_address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="border-b">
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm">${item.unit_price}</td>
                    <td className="px-4 py-3 text-sm font-semibold">${item.line_total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-700">
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 text-lg font-bold text-blue-600">
                    ${invoice.total_amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Transactions */}
        {invoice.transactions && invoice.transactions.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Related Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
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
                        {new Date(transaction.transaction_date).toLocaleDateString()} at{' '}
                        {new Date(transaction.transaction_date).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/invoices')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back to List
            </button>
            {invoice.status === 'Pending' && (
              <button
                onClick={handlePay}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Mark as Paid
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Delete Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;

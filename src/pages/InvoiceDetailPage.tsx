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
      // Validate ID exists and is a valid number
      if (!id || id === 'undefined' || isNaN(Number(id))) {
        alert('Error fetching invoice: Not found.');
        navigate('/invoices');
        return;
      }

      try {
        const data = await getInvoice(Number(id));
        setInvoice(data);
      } catch (error: unknown) {
        console.error('Error fetching invoice:', error);
        const message = error instanceof Error 
          ? error.message
          : (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 
            'Failed to fetch invoice';
        alert('Error fetching invoice: ' + message);
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  const handlePay = async () => {
    if (!invoice) return;

    try {
      const updated = await payInvoice(invoice.id);
      setInvoice(updated);
      alert('Invoice marked as paid successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message
        : (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 
          'Failed to mark invoice as paid';
      alert('Error paying invoice: ' + message);
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
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message
        : (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 
          'Failed to delete invoice';
      alert('Error deleting invoice: ' + message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center text-lg text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-6 py-10">
        <p className="text-center text-lg text-slate-500">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Invoice Details</h1>
          <span
            className={`px-5 py-2 rounded-full text-base font-semibold ${
              invoice.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        {/* Invoice Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Invoice Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">Reference Number:</span>
                  <p className="font-semibold text-slate-900">{invoice.reference_number}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Created Date:</span>
                  <p className="font-medium text-slate-700">
                    {new Date(invoice.created_at).toLocaleDateString()} at{' '}
                    {new Date(invoice.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Last Updated:</span>
                  <p className="font-medium text-slate-700">
                    {new Date(invoice.updated_at).toLocaleDateString()} at{' '}
                    {new Date(invoice.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">Name:</span>
                  <p className="font-semibold text-slate-900">{invoice.customer_name}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Email:</span>
                  <p className="font-medium text-slate-700">{invoice.customer_email}</p>
                </div>
                {invoice.customer_phone && (
                  <div>
                    <span className="text-sm text-slate-500">Phone:</span>
                    <p className="font-medium text-slate-700">{invoice.customer_phone}</p>
                  </div>
                )}
                {invoice.customer_address && (
                  <div>
                    <span className="text-sm text-slate-500">Address:</span>
                    <p className="font-medium text-slate-700">{invoice.customer_address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-4 py-3 text-sm text-slate-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">${item.unit_price}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">${item.line_total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-right font-semibold text-slate-700">
                    Total Amount:
                  </td>
                  <td className="px-4 py-4 text-lg font-bold text-slate-900">
                    ${invoice.total_amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Transactions */}
        {invoice.transactions && invoice.transactions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Related Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 text-sm">
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
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">${transaction.amount}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
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
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/invoices')}
              className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Back to List
            </button>
            {invoice.status === 'Pending' && (
              <button
                onClick={handlePay}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Mark as Paid
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
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

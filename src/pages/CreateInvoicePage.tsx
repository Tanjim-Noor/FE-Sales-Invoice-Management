import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../api/client';
import type { InvoiceItem } from '../types';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Customer fields
  const [referenceNumber, setReferenceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Items
  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'line_total'>[]>([
    { description: '', quantity: 1, unit_price: '0' },
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: '0' }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      alert('At least one item is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Omit<InvoiceItem, 'id' | 'line_total'>, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity * parseFloat(item.unit_price || '0'));
    }, 0).toFixed(2);
  };

  const validateForm = () => {
    if (!referenceNumber.trim()) {
      alert('Reference number is required');
      return false;
    }
    if (!customerName.trim()) {
      alert('Customer name is required');
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      alert('Valid email is required');
      return false;
    }
    if (items.length === 0) {
      alert('At least one item is required');
      return false;
    }
    for (let i = 0; i < items.length; i++) {
      if (!items[i].description.trim()) {
        alert(`Item ${i + 1}: Description is required`);
        return false;
      }
      if (items[i].quantity < 1) {
        alert(`Item ${i + 1}: Quantity must be at least 1`);
        return false;
      }
      if (parseFloat(items[i].unit_price) < 0) {
        alert(`Item ${i + 1}: Unit price cannot be negative`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        reference_number: referenceNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || undefined,
        customer_address: customerAddress || undefined,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      const invoice = await createInvoice(data);
      alert('Invoice created successfully!');
      navigate(`/invoices/${invoice.id}`);
    } catch (error: any) {
      const message = error.response?.data?.detail || 
                     error.response?.data?.reference_number?.[0] || 
                     'Failed to create invoice';
      alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Create New Invoice</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-5 text-slate-900">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="INV-2025-001"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="+1-555-0199"
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Customer Address
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="123 Main St, City, State 12345"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                disabled={loading}
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-5">
              {items.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-slate-900">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Web Development Services"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        min="1"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="border border-slate-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Line Total
                      </label>
                      <div className="border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 font-medium text-slate-900">
                        ${(item.quantity * parseFloat(item.unit_price || '0')).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-700">Total Amount:</h3>
              <p className="text-3xl font-bold text-slate-900">${calculateTotal()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg disabled:bg-slate-400 font-medium transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 px-8 py-3 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePage;

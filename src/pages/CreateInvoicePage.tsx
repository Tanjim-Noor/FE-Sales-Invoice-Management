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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Invoice</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {/* Customer Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="INV-2025-001"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="+1-555-0199"
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Address
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  placeholder="123 Main St, City, State 12345"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                disabled={loading}
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        placeholder="Web Development Services"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        min="1"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Line Total
                      </label>
                      <div className="border border-gray-200 bg-gray-50 rounded px-3 py-2">
                        ${(item.quantity * parseFloat(item.unit_price || '0')).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mb-6 bg-gray-50 rounded p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-700">Total Amount:</h3>
              <p className="text-2xl font-bold text-blue-600">${calculateTotal()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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

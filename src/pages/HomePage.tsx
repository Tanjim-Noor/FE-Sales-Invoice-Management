import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../api/client';

const HomePage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all invoices to calculate stats
        const data = await getInvoices({ page_size: 1000 });
        const invoices = data.results;

        setStats({
          total: invoices.length,
          pending: invoices.filter(inv => inv.status === 'Pending').length,
          paid: invoices.filter(inv => inv.status === 'Paid').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Invoices</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Invoices</h3>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Paid Invoices</h3>
          <p className="text-4xl font-bold text-green-600">{stats.paid}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            to="/invoices"
            className="block bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 text-center"
          >
            View All Invoices
          </Link>
          <Link
            to="/invoices/create"
            className="block bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 text-center"
          >
            Create New Invoice
          </Link>
          <Link
            to="/transactions"
            className="block bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 text-center"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

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
        <p className="text-lg text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10 text-slate-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-3">Total Invoices</h3>
          <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-3">Pending Invoices</h3>
          <p className="text-4xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-slate-500 text-sm font-medium mb-3">Paid Invoices</h3>
          <p className="text-4xl font-bold text-emerald-600">{stats.paid}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-5 text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/invoices"
            className="border border-slate-300 hover:border-slate-400 bg-white px-6 py-4 rounded-lg text-center font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            View All Invoices
          </Link>
          <Link
            to="/invoices/create"
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-lg text-center font-medium transition-colors"
          >
            Create New Invoice
          </Link>
          <Link
            to="/transactions"
            className="border border-slate-300 hover:border-slate-400 bg-white px-6 py-4 rounded-lg text-center font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            View Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

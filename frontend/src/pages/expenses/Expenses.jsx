import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { getCategoryConfig } from '../../constants/categories';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await expenseService.getExpenses();
      if (res && res.success) {
        setExpenses(res.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setIsDeleting(id);
      try {
        const res = await expenseService.deleteExpense(id);
        if (res && res.success) {
          setExpenses(expenses.filter(e => e._id !== id));
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">All Expenses</h1>
          <p className="text-text-secondary mt-1">Manage and view all your recorded expenses</p>
        </div>
        <Link to="/add-expense" className="bg-primary-accent text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md">
          + New Expense
        </Link>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border-color bg-slate-50/50">
          <Input
            type="text"
            placeholder="Search expenses..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-border-color text-xs uppercase tracking-wider text-text-secondary font-semibold">
                <th className="p-4 sm:p-6 py-4">Expense</th>
                <th className="p-4 sm:p-6 py-4">Category</th>
                <th className="p-4 sm:p-6 py-4">Date</th>
                <th className="p-4 sm:p-6 py-4">Amount</th>
                <th className="p-4 sm:p-6 py-4">Receipt</th>
                <th className="p-4 sm:p-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-secondary">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const categoryConfig = getCategoryConfig(expense.category);
                  const Icon = categoryConfig.icon;
                  
                  return (
                    <tr key={expense._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 sm:p-6 py-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: categoryConfig.color }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-text-primary">{expense.title}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6 py-4 text-sm text-text-secondary font-medium">
                        {expense.category}
                      </td>
                      <td className="p-4 sm:p-6 py-4 text-sm text-text-secondary font-medium">
                        {new Date(expense.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 sm:p-6 py-4 font-bold text-text-primary">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-6 py-4">
                        {expense.receipt ? (
                          <a href={expense.receipt} target="_blank" rel="noreferrer" className="text-secondary-accent hover:underline flex items-center text-sm font-medium">
                            <ImageIcon className="w-4 h-4 mr-1.5" /> View
                          </a>
                        ) : (
                          <span className="text-text-secondary text-sm italic">None</span>
                        )}
                      </td>
                      <td className="p-4 sm:p-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            className="p-2 text-text-secondary hover:text-secondary-accent transition-colors rounded-lg hover:bg-secondary-accent/10"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(expense._id)}
                            disabled={isDeleting === expense._id}
                            className="p-2 text-text-secondary hover:text-danger transition-colors rounded-lg hover:bg-danger/10 disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeleting === expense._id ? (
                              <Loader size="sm" color="primary" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Expenses;

import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { getCategoryConfig } from '../../constants/categories';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar as CalendarIcon, 
  ArrowRight,
  Coffee,
  Car
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.transactionDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((acc, curr) => acc + curr.amount, 0);

  const foodExpenses = expenses.filter(e => e.category === 'Food')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const travelExpenses = expenses.filter(e => e.category === 'Travel')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const recentExpenses = expenses.slice(0, 5);

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
          <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
          <p className="text-text-secondary mt-1">Here's a summary of your financial activity</p>
        </div>
        <Link to="/add-expense" className="bg-primary-accent text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md">
          + New Expense
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Expenses</p>
              <h3 className="text-2xl font-bold text-text-primary mt-2">${totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-primary-accent/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary-accent" />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-secondary">This Month</p>
              <h3 className="text-2xl font-bold text-text-primary mt-2">${monthlyExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-secondary-accent/10 rounded-xl">
              <CalendarIcon className="w-5 h-5 text-secondary-accent" />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-secondary">Food & Dining</p>
              <h3 className="text-2xl font-bold text-text-primary mt-2">${foodExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-secondary">Travel</p>
              <h3 className="text-2xl font-bold text-text-primary mt-2">${travelExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Car className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="p-6 border-b border-border-color flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-text-primary">Recent Expenses</h2>
          <Link to="/expenses" className="text-sm font-medium text-primary-accent hover:text-emerald-600 flex items-center transition-colors">
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border-color">
          {recentExpenses.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No expenses recorded yet.
            </div>
          ) : (
            recentExpenses.map((expense) => {
              const categoryConfig = getCategoryConfig(expense.category);
              const Icon = categoryConfig.icon;
              
              return (
                <div key={expense._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: categoryConfig.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{expense.title}</p>
                      <p className="text-xs text-text-secondary mt-1 font-medium">
                        {new Date(expense.transactionDate).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-text-primary">
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

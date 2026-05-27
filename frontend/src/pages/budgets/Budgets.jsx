import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Calendar as CalendarIcon,
  Plus,
  Loader2,
  FileText,
  Bell,
  MoreVertical,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { apiService } from '../../services/api';
import AddBudgetModal from '../../components/common/AddBudgetModal';
import toast from 'react-hot-toast';
import { getCategoryConfig } from '../../constants/categories';
import { useData } from '../../context/DataContext';

const Budgets = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useData();
  
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  // Date state: YYYY-MM
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchData();
  }, [currentMonth, refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        apiService.getBudgets(currentMonth),
        apiService.getTransactions()
      ]);
      
      if (budgetsRes.data.success) {
        setBudgets(budgetsRes.data.data);
      }
      if (transactionsRes.data.success) {
        // Filter transactions for current month and expense type
        const [year, month] = currentMonth.split('-');
        const filtered = transactionsRes.data.data.filter(t => {
          if (t.type !== 'expense') return false;
          const d = new Date(t.date);
          return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
        });
        setTransactions(filtered);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      const res = await apiService.deleteBudget(id);
      if (res.data.success) {
        toast.success('Budget deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  // --- Calculations ---
  
  // 1. Overall Monthly Budget
  const totalBudget = budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const overallRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  
  const hasToasted80 = useRef(false);
  const hasToasted100 = useRef(false);

  useEffect(() => {
    if (totalBudget > 0 && !loading) {
      if (totalSpent >= totalBudget && !hasToasted100.current) {
        toast.error('🚨 Monthly budget exceeded.', { duration: 5000, style: { background: '#FEF2F2', color: '#991B1B' } });
        hasToasted100.current = true;
      } else if (totalSpent >= totalBudget * 0.8 && totalSpent < totalBudget && !hasToasted80.current) {
        toast('⚠ You have used 80% of your monthly budget.', { icon: '⚠', duration: 5000, style: { background: '#FFF7ED', color: '#C2410C' } });
        hasToasted80.current = true;
      }
    }
  }, [totalSpent, totalBudget, loading]);
  
  let overallHealth = 'On Track';
  let overallHealthColor = 'text-green-600 dark:text-[#10B981]';
  let overallHealthIcon = CheckCircle2;
  
  if (totalBudget > 0) {
    if (totalSpent > totalBudget) {
      overallHealth = 'Exceeded';
      overallHealthColor = 'text-red-500 dark:text-red-400';
      overallHealthIcon = AlertCircle;
    } else if (totalSpent > totalBudget * 0.9) {
      overallHealth = 'Near Limit';
      overallHealthColor = 'text-orange-500 dark:text-orange-400';
      overallHealthIcon = AlertTriangle;
    }
  }

  // 2. Category Budgets
  const categoryStats = budgets.map(b => {
    const spent = transactions
      .filter(t => t.category === b.category)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const remaining = b.limitAmount - spent;
    const percentage = Math.min(Math.round((spent / b.limitAmount) * 100), 100);
    const rawPercentage = (spent / b.limitAmount) * 100;
    
    let status = 'On Track';
    let statusColor = 'bg-green-100 text-green-700 dark:bg-[#10B981]/20 dark:text-[#10B981]';
    let barColor = 'bg-[#144933] dark:bg-[#10B981]';
    
    if (rawPercentage > 100) {
      status = 'Exceeded';
      statusColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      barColor = 'bg-red-500';
    } else if (rawPercentage > 90) {
      status = 'Near Limit';
      statusColor = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      barColor = 'bg-orange-500';
    }

    return {
      ...b,
      spent,
      remaining,
      percentage,
      rawPercentage,
      status,
      statusColor,
      barColor,
      config: getCategoryConfig(b.category)
    };
  });

  // 3. Alerts
  const alerts = categoryStats.filter(c => c.status !== 'On Track').slice(0, 3);
  if (alerts.length < 3 && categoryStats.length > 0) {
     // Add a fake positive alert if space permits
     alerts.push({
       type: 'positive',
       category: categoryStats[0].category,
       message: 'Great! You are within your limit.',
       title: `${categoryStats[0].category} budget is under control`
     });
  }



  // Date Formatting for display
  const [y, m] = currentMonth.split('-');
  const displayDate = new Date(y, m - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startDay = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDay = new Date(y, m, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#144933] dark:text-[#10B981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Budgets</h1>
            <Wallet className="w-6 h-6 text-[#144933] dark:text-[#10B981]" />
          </div>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Set limits, track progress, and take control of your money.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
             <input
               type="month"
               value={currentMonth}
               onChange={(e) => setCurrentMonth(e.target.value)}
               className="h-11 px-4 pl-10 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981]"
             />
             <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button 
            onClick={() => navigate('/reports')}
            className="h-11 px-4 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-[#334155]/50 hover:scale-105 transform cursor-pointer"
          >
             <FileText className="w-4 h-4 text-[#144933] dark:text-[#10B981]" />
             View Reports
          </button>
          <button 
            onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
            className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white h-11 px-6 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-[18px] h-[18px]" />
            Create New Budget
          </button>
        </div>
      </div>

      {/* Monthly Budget Summary */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm mb-6 shrink-0 transition-colors">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Monthly Budget</p>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-[28px] font-bold text-gray-900 dark:text-white transition-colors">₹{totalBudget.toLocaleString()}</h3>
            </div>
            <button className="text-[12px] text-[#144933] dark:text-[#10B981] font-medium flex items-center gap-1 hover:underline">
              ✎ Edit Budget
            </button>
          </div>
          
          <div>
            <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Total Spent</p>
            <h3 className="text-[28px] font-bold text-[#D97706] dark:text-[#F59E0B] transition-colors">₹{totalSpent.toLocaleString()}</h3>
            <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] font-medium">{overallPercentage.toFixed(1)}% of budget</p>
          </div>

          <div>
            <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Remaining</p>
            <h3 className={`text-[28px] font-bold ${overallRemaining < 0 ? 'text-red-600' : 'text-[#10B981]'} transition-colors`}>
              ₹{overallRemaining.toLocaleString()}
            </h3>
            <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] font-medium">{Math.max(100 - overallPercentage, 0).toFixed(1)}% left</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-2 transition-colors">Budget Health</p>
              <div className="flex items-center gap-2 mb-1">
                <overallHealthIcon className={`w-5 h-5 ${overallHealthColor}`} />
                <span className={`font-bold text-[16px] ${overallHealthColor}`}>{overallHealth}</span>
              </div>
              <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] font-medium">{overallRemaining >= 0 ? "You're doing great!" : "Time to cut back!"}</p>
            </div>
            <div className="w-20 h-20 bg-green-50 dark:bg-[#10B981]/10 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden hidden xl:flex">
               <Wallet className="w-10 h-10 text-[#144933] dark:text-[#10B981] absolute bottom-3 z-10" />
               <div className="absolute w-8 h-8 bg-green-200 dark:bg-[#10B981]/30 rounded-full -top-1 -right-1"></div>
               <div className="absolute w-4 h-4 bg-yellow-400 rounded-full bottom-2 right-2"></div>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-[11px] font-medium text-gray-400 w-6">0%</span>
          <div className="flex-1 h-3 bg-gray-100 dark:bg-[#334155] rounded-full overflow-hidden relative">
             {/* Divider markers */}
             <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gray-300 dark:bg-[#475569] z-0"></div>
             <div className="absolute top-0 bottom-0 left-[100%] w-px bg-gray-300 dark:bg-[#475569] z-0"></div>
             
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${overallPercentage}%` }}
               transition={{ duration: 1 }}
               className={`h-full rounded-full relative z-10 ${overallRemaining < 0 ? 'bg-red-500' : 'bg-[#144933] dark:bg-[#10B981]'}`}
             >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white leading-none">
                  {overallPercentage.toFixed(1)}%
                </span>
             </motion.div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 w-8">100%</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex gap-6 shrink-0">
        
        {/* Left Column (Category Budgets + Charts) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Category Budgets Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors">
            <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-6">Category Budgets</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[12px] text-gray-500 dark:text-[#94A3B8] border-b border-gray-100 dark:border-[#334155]">
                    <th className="pb-3 font-medium px-2">Category</th>
                    <th className="pb-3 font-medium">Budget</th>
                    <th className="pb-3 font-medium">Spent</th>
                    <th className="pb-3 font-medium">Remaining</th>
                    <th className="pb-3 font-medium w-[120px]">Status</th>
                    <th className="pb-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-sm text-gray-500">No budgets set for this month.</td>
                    </tr>
                  ) : categoryStats.map((item, idx) => {
                    const Icon = item.config.icon;
                    return (
                      <motion.tr 
                        key={item._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-50 dark:border-[#334155]/50 last:border-0 hover:bg-gray-50 dark:hover:bg-[#334155]/30 transition-colors group"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-80" style={{ backgroundColor: `${item.config.color}20` }}>
                              <Icon className="w-4 h-4" style={{ color: item.config.color }} />
                            </div>
                            <span className="text-[14px] font-medium text-gray-900 dark:text-white">{item.category}</span>
                          </div>
                        </td>
                        <td className="py-4 text-[14px] text-gray-600 dark:text-[#94A3B8]">₹{item.limitAmount.toLocaleString()}</td>
                        <td className="py-4 text-[14px] font-medium text-gray-900 dark:text-white">₹{item.spent.toLocaleString()}</td>
                        <td className="py-4 text-[14px] text-gray-600 dark:text-[#94A3B8]">₹{item.remaining.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${item.statusColor}`}>
                              {item.status}
                            </span>
                            <div className="w-12 h-1.5 bg-gray-100 dark:bg-[#334155] rounded-full overflow-hidden shrink-0">
                               <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.percentage}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                           <div className="relative inline-block group">
                              <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-[#334155]">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {/* Simple hover dropdown for edit/delete */}
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-[#334155] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                                 <button onClick={() => { setEditingBudget(item); setIsModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1E293B]">Edit</button>
                                 <button onClick={() => handleDeleteBudget(item._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                              </div>
                           </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <button 
              onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
              className="mt-4 w-full py-3 border border-dashed border-gray-300 dark:border-[#475569] rounded-xl text-[14px] font-medium text-[#144933] dark:text-[#10B981] hover:bg-green-50 dark:hover:bg-[#10B981]/10 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Category Budget
            </button>
          </div>



        </div>

        {/* Right Column (Alerts + Recommendations) */}
        <div className="w-[320px] flex flex-col gap-6 shrink-0">
          


          {/* Smart Recommendations */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-4">Smart Recommendations</h3>
            
            <div className="space-y-4">
               {/* Static Recommendations */}
               <div className="flex gap-3 border-b border-gray-50 dark:border-[#334155]/50 pb-4 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Reduce dining expenses by ₹500</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">to stay on track this month.</p>
                  </div>
               </div>

               <div className="flex gap-3 border-b border-gray-50 dark:border-[#334155]/50 pb-4 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Travel spending is within budget</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">You are managing transportation well.</p>
                  </div>
               </div>

               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center shrink-0 text-green-600 dark:text-[#10B981]">
                     <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">You can save ₹2000 this month</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">Keep up the great work!</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Savings Impact Banner */}
          <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl p-5 border border-transparent dark:border-[#10B981]/20 relative overflow-hidden transition-colors mt-auto">
             <div className="relative z-10 text-center w-full">
               <div className="w-10 h-10 bg-green-100 dark:bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-[#144933] dark:text-[#10B981]" />
               </div>
               <h4 className="text-[13px] font-bold text-[#144933] dark:text-white mb-2 leading-tight">Reducing food expenses by 10%<br />could save you ₹1200/month.</h4>
               <p className="text-[11px] text-[#2D4A3E] dark:text-gray-400">Small changes make a big impact.</p>
             </div>
          </div>

        </div>
      </div>

      <AddBudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        initialMonth={currentMonth}
        existingBudget={editingBudget}
      />
    </div>
  );
};

export default Budgets;

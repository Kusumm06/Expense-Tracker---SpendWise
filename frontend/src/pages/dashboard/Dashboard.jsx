import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Download,
  PiggyBank,
  PieChart as PieChartIcon,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { apiService } from '../../services/api';
import Loader from '../../components/common/Loader';
import { useData } from '../../context/DataContext';

const COLORS = ['#144933', '#22C55E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#9CA3AF'];
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Others'];

const Dashboard = () => {
  const { refreshTrigger, toggleGoalModal, toggleExpenseModal } = useData();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBalance: { amount: 0, trend: '0%' },
    totalIncome: { amount: 0, trend: '0%' },
    totalExpenses: { amount: 0, trend: '0%' },
    savingsLeft: { amount: 0, trend: '0%' },
    monthlyBudget: { amount: 0, spent: 0 }
  });
  const [trends, setTrends] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, trendsRes, catRes, goalsRes] = await Promise.all([
          apiService.getSummary(),
          apiService.getTrends(),
          apiService.getCategories(),
          apiService.getGoals()
        ]);

        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (trendsRes.data.success) setTrends(trendsRes.data.data);
        if (catRes.data.success) setCategoryStats(catRes.data.data);
        if (goalsRes.data.success) setGoals(goalsRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Calculate budget percentage
  const budgetPercentage = summary.monthlyBudget.amount > 0 
    ? Math.min(100, Math.round((summary.monthlyBudget.spent / summary.monthlyBudget.amount) * 100))
    : 0;

  // Custom Tooltip for Line Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E293B] px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-[#334155] flex flex-col items-center transition-colors">
          <p className="text-[12px] text-gray-500 dark:text-[#94A3B8] font-medium mb-1">{label}</p>
          <p className="text-[14px] text-[#144933] dark:text-[#10B981] font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full h-full gap-6 pb-20 overflow-hidden">
      
      {/* LEFT MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
        
        {/* ROW 1: Summary Cards */}
        <div className="grid grid-cols-4 gap-6 shrink-0">
          
          {/* Total Income */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`rounded-[20px] p-5 shadow-sm relative overflow-hidden group transition-colors border bg-white dark:bg-[#1E293B] border-[#F0F0F0] dark:border-[#334155]`}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-[#EEF5ED] dark:bg-[#10B981]/10`}>
                <Wallet className={`w-5 h-5 text-[#22C55E] dark:text-[#10B981]`} />
              </div>
              <div className="pt-1">
                <p className={`text-[13px] font-medium transition-colors text-gray-500 dark:text-[#94A3B8]`}>
                  Total Income
                </p>
                <h3 className={`text-[22px] font-bold mt-0.5 transition-colors text-[#1F2937] dark:text-white`}>
                  {formatCurrency(summary.totalIncome.amount)}
                </h3>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-[12px] font-medium text-[#22C55E]`}>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{summary.totalIncome.trend} vs last month</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-full fill-transparent stroke-2 stroke-[#22C55E]`}>
                <path d="M0 30 Q 20 10, 40 20 T 80 10 T 100 20" />
              </svg>
            </div>
          </motion.div>

          {/* Total Expenses */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1E293B] rounded-[20px] p-5 border border-[#F0F0F0] dark:border-[#334155] shadow-sm relative overflow-hidden transition-colors"
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center transition-colors">
                <Download className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="pt-1">
                <p className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8] transition-colors">Total Expenses</p>
                <h3 className="text-[22px] font-bold text-[#1F2937] dark:text-white mt-0.5 transition-colors">{formatCurrency(summary.totalExpenses.amount)}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-orange-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{summary.totalExpenses.trend} vs last month</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-orange-500 fill-transparent stroke-2">
                <path d="M0 20 Q 20 30, 40 10 T 80 20 T 100 10" />
              </svg>
            </div>
          </motion.div>

          {/* Savings Left */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`rounded-[20px] p-5 shadow-sm relative overflow-hidden transition-colors border ${summary.savingsLeft.amount < 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : 'bg-white dark:bg-[#1E293B] border-[#F0F0F0] dark:border-[#334155]'}`}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${summary.savingsLeft.amount < 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-50 dark:bg-orange-500/10'}`}>
                <PiggyBank className={`w-5 h-5 ${summary.savingsLeft.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`} />
              </div>
              <div className="pt-1">
                <p className={`text-[13px] font-medium transition-colors ${summary.savingsLeft.amount < 0 ? 'text-red-600/70 dark:text-red-400/70' : 'text-gray-500 dark:text-[#94A3B8]'}`}>
                  {summary.savingsLeft.amount < 0 ? 'Overspent By' : 'Savings Left'}
                </p>
                <h3 className={`text-[22px] font-bold mt-0.5 transition-colors ${summary.savingsLeft.amount < 0 ? 'text-red-700 dark:text-red-300' : 'text-[#1F2937] dark:text-white'}`}>
                  {formatCurrency(Math.abs(summary.savingsLeft.amount))}
                </h3>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-[12px] font-medium ${summary.savingsLeft.amount < 0 ? 'text-red-500' : 'text-[#22C55E]'}`}>
              {summary.savingsLeft.trend.startsWith('-') ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
              <span>{summary.savingsLeft.trend} vs last month</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-full fill-transparent stroke-2 ${summary.savingsLeft.amount < 0 ? 'stroke-red-500' : 'stroke-orange-500'}`}>
                <path d="M0 25 Q 30 10, 50 20 T 100 5" />
              </svg>
            </div>
          </motion.div>

          {/* Monthly Budget */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#1E293B] rounded-[20px] p-5 border border-[#F0F0F0] dark:border-[#334155] shadow-sm relative flex items-center transition-colors overflow-hidden justify-between"
          >
            {/* Left Info */}
            <div className="flex flex-col h-full justify-between z-10 w-[45%]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 transition-colors">
                  <PieChartIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="pt-1">
                  <p className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8] transition-colors leading-tight">Monthly Budget</p>
                </div>
              </div>
            </div>
            
            {/* Circular Progress Centered Overlap Fix */}
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[160px] h-[160px] pointer-events-none opacity-80">
               <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-gray-100 dark:text-gray-700 transition-colors"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-purple-500 dark:text-purple-400 drop-shadow-sm transition-all duration-1000 ease-out"
                    strokeDasharray={`${budgetPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text inside ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[14px] font-bold text-purple-600 dark:text-purple-400">{budgetPercentage}%</span>
                  <span className="text-[8px] font-semibold text-gray-500 mt-0.5 px-2 text-center leading-tight">
                    {formatCurrency(summary.monthlyBudget.spent)} <br/> / <br/> {formatCurrency(summary.monthlyBudget.amount)}
                  </span>
                </div>
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Charts */}
        <div className="flex gap-6 shrink-0 h-[360px]">
          
          {/* Monthly Spending Trend */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-[3] bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border border-[#F0F0F0] dark:border-[#334155] shadow-sm flex flex-col transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[16px] text-[#1F2937] dark:text-white transition-colors">Monthly Spending Trend</h3>
              <select className="bg-gray-50 dark:bg-[#0F172A] border-none text-[13px] font-medium text-gray-500 dark:text-[#94A3B8] outline-none cursor-pointer px-3 py-1.5 rounded-lg transition-colors">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="flex-1 w-full h-full pb-4">
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                      dy={10} 
                      minTickGap={20}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                      tickFormatter={(value) => `₹${value/1000}k`} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#22C55E" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorIncome)"
                      activeDot={{ r: 6, fill: '#fff', stroke: '#22C55E', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#F59E0B" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorExpense)"
                      activeDot={{ r: 6, fill: '#fff', stroke: '#F59E0B', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No trend data for this month</div>
              )}
            </div>
          </motion.div>

          {/* Expense Breakdown */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex-[2] bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border border-[#F0F0F0] dark:border-[#334155] shadow-sm flex flex-col transition-colors"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-[16px] text-[#1F2937] dark:text-white transition-colors">Expense Breakdown</h3>
              <select className="bg-gray-50 dark:bg-[#0F172A] border-none text-[13px] font-medium text-gray-500 dark:text-[#94A3B8] outline-none cursor-pointer px-3 py-1.5 rounded-lg transition-colors">
                <option>This Month</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-center justify-between">
              {/* Donut Chart */}
              <div className="w-[180px] h-[180px] relative">
                {categoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="amount"
                        stroke="none"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Data</div>
                )}
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[16px] font-bold text-[#1F2937] dark:text-white transition-colors">{formatCurrency(summary.totalExpenses.amount)}</span>
                  <span className="text-[11px] text-gray-500 dark:text-[#94A3B8] font-medium transition-colors">Total Spend</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 flex flex-col gap-2.5 ml-6">
                {categoryStats.slice(0, 6).map((stat, i) => (
                  <div key={i} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium transition-colors">{stat.category}</span>
                    </div>
                    <div className="flex gap-3 text-right">
                      <span className="font-semibold text-[#1F2937] dark:text-white w-14 transition-colors">{formatCurrency(stat.amount).replace('₹', '₹ ')}</span>
                      <span className="text-gray-400 dark:text-gray-500 w-8 transition-colors">{stat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ROW 3: Savings Goals */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border border-[#F0F0F0] dark:border-[#334155] shadow-sm shrink-0 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[16px] text-[#1F2937] dark:text-white transition-colors">Savings Goals</h3>
            <button 
              onClick={() => navigate('/goals')}
              className="text-[13px] font-medium text-[#144933] dark:text-[#10B981] flex items-center gap-1 hover:underline hover:scale-105 transform transition-all cursor-pointer"
            >
              View All Goals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Display Top 2 Goals + Create New button */}
            {goals.slice(0, 2).map((goal, i) => {
              const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal._id} className="flex gap-4 items-center bg-gray-50/50 dark:bg-[#0F172A]/50 p-4 rounded-[16px] border border-gray-100 dark:border-[#334155] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1E293B] flex items-center justify-center shadow-sm text-2xl transition-colors">
                    {i === 0 ? '💻' : '✈️'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[14px] text-[#1F2937] dark:text-white mb-1 transition-colors">{goal.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                        <div className="h-full bg-[#144933] dark:bg-[#10B981] rounded-full transition-colors" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="text-[12px] font-bold text-gray-500 dark:text-[#94A3B8] transition-colors">{percent}%</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500 dark:text-[#64748B] transition-colors">
                      <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                      <span>Estimated: {Math.ceil((goal.targetAmount - goal.currentAmount) / summary.savingsLeft.amount) || 1} months left</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Goal Button */}
            <button 
              onClick={toggleGoalModal}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-[#144933]/30 dark:border-[#10B981]/30 rounded-[16px] text-[#144933] dark:text-[#10B981] font-medium text-[14px] hover:bg-[#EEF5ED] dark:hover:bg-[#10B981]/10 hover:border-[#144933]/50 dark:hover:border-[#10B981]/50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create New Goal
            </button>
          </div>
        </motion.div>

      </div>

      {/* RIGHT SIDEBAR: INSIGHTS (Width: ~320px) */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-[320px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar"
      >
        
        {/* Insights Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[24px] p-6 border border-[#F0F0F0] dark:border-[#334155] shadow-sm flex flex-col gap-5 transition-colors">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors" />
            <h3 className="font-semibold text-[16px] text-[#1F2937] dark:text-white transition-colors">Insights</h3>
          </div>

          {/* Insight 1 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0 transition-colors">
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400 transition-colors" />
            </div>
            <p className="text-[13px] text-gray-600 dark:text-[#94A3B8] leading-relaxed pt-1 transition-colors">
              <span className="font-semibold text-[#1F2937] dark:text-white transition-colors">You spent 18% less</span> this week compared to last week. Great job!
            </p>
          </div>

          {/* Insight 2 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0 transition-colors">
              <Target className="w-5 h-5 text-orange-500 dark:text-orange-400 transition-colors" />
            </div>
            <p className="text-[13px] text-gray-600 dark:text-[#94A3B8] leading-relaxed pt-1 transition-colors">
              <span className="font-semibold text-[#1F2937] dark:text-white transition-colors">Food</span> is your highest spending category this month.
            </p>
          </div>

          {/* Insight 3 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 transition-colors">
              <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400 transition-colors" />
            </div>
            <p className="text-[13px] text-gray-600 dark:text-[#94A3B8] leading-relaxed pt-1 transition-colors">
              You're <span className="font-semibold text-[#1F2937] dark:text-white transition-colors">25% away</span> from reaching your monthly budget limit.
            </p>
          </div>

          <motion.button 
            whileHover={{ y: -2 }}
            onClick={() => navigate('/analytics')}
            className="text-[13px] font-medium text-[#144933] dark:text-[#10B981] flex items-center justify-center gap-1 mt-2 hover:underline transition-all py-2 rounded-xl hover:bg-[#EEF5ED] dark:hover:bg-[#10B981]/10 w-full"
          >
            View all insights <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Promo / Banner Card */}
        <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-[24px] p-6 border border-[#144933]/10 dark:border-[#10B981]/20 relative overflow-hidden flex flex-col justify-between min-h-[200px] transition-colors">
          <div className="relative z-10 w-[70%]">
            <h3 className="font-bold text-[18px] text-[#144933] dark:text-[#10B981] leading-snug mb-2 transition-colors">Take control of your finances</h3>
            <p className="text-[13px] text-[#144933]/80 dark:text-[#10B981]/80 leading-relaxed mb-5 transition-colors">
              Add your expenses, set budgets and achieve your goals.
            </p>
            <button 
              onClick={toggleExpenseModal}
              className="bg-[#144933] dark:bg-[#10B981] text-white px-5 py-2.5 rounded-xl font-medium text-[13px] shadow-sm hover:bg-[#0f3826] dark:hover:bg-[#059669] transition-colors"
            >
              + Add Expense
            </button>
          </div>
          {/* Mockup Wallet Image Graphic */}
          <div className="absolute -bottom-4 -right-4 text-[90px] drop-shadow-xl rotate-[-10deg]">
            👛
          </div>
        </div>

      </motion.div>

    </div>
  );
};

export default Dashboard;

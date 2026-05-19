import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  MoreHorizontal
} from 'lucide-react';
import { apiService } from '../../services/api';
import Loader from '../../components/common/Loader';

const COLORS = ['#184734', '#22C55E', '#8DA57B', '#F59E0B', '#3B82F6', '#EF4444'];

const getCategoryIcon = (category) => {
  switch(category?.toLowerCase()) {
    case 'food & dining': return <Coffee className="w-5 h-5 text-[#F59E0B]" />;
    case 'shopping': return <ShoppingBag className="w-5 h-5 text-[#3B82F6]" />;
    case 'housing': return <Home className="w-5 h-5 text-[#8DA57B]" />;
    case 'transport': return <Car className="w-5 h-5 text-[#EF4444]" />;
    default: return <Wallet className="w-5 h-5 text-[#184734]" />;
  }
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalBalance: 0, totalIncome: 0, totalExpense: 0, netSavings: 0 });
  const [transactions, setTransactions] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, transRes, catRes, trendsRes, budgetsRes, goalsRes] = await Promise.all([
          apiService.getSummary(),
          apiService.getTransactions(),
          apiService.getCategories(),
          apiService.getTrends(),
          apiService.getBudgets(),
          apiService.getGoals()
        ]);

        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (transRes.data.success) setTransactions(transRes.data.data.slice(0, 5)); // Get top 5
        if (catRes.data.success) setCategoryStats(catRes.data.data);
        if (trendsRes.data.success) setTrends(trendsRes.data.data);
        if (budgetsRes.data.success) setBudgets(budgetsRes.data.data);
        if (goalsRes.data.success) setGoals(goalsRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="flex w-full h-full p-[40px] pt-0 gap-[32px] overflow-hidden">
      
      {/* MIDDLE SECTION (Main Content) */}
      <div className="flex-grow flex flex-col gap-8 overflow-y-auto pr-4 custom-scrollbar pb-[100px]">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 shrink-0">
          {[
            { title: 'Total Balance', amount: summary.totalBalance, icon: Wallet, color: '#184734', trend: '+2.5%' },
            { title: 'Total Income', amount: summary.totalIncome, icon: TrendingUp, color: '#22C55E', trend: '+12.4%' },
            { title: 'Total Expenses', amount: summary.totalExpense, icon: TrendingDown, color: '#EF4444', trend: '-4.1%' },
            { title: 'Net Savings', amount: summary.netSavings, icon: PiggyBank, color: '#3B82F6', trend: '+8.2%' },
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:translate-y-[-2px] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <div className={`flex items-center gap-1 text-[13px] font-medium px-2 py-1 rounded-full ${card.trend.startsWith('+') ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#EF4444] bg-[#EF4444]/10'}`}>
                  {card.trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {card.trend.replace('+', '').replace('-', '')}
                </div>
              </div>
              <h3 className="text-[15px] font-medium text-[#6E7A71] mb-1">{card.title}</h3>
              <p className="text-[28px] font-bold text-[#1D4735] tracking-tight">{formatCurrency(card.amount)}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="flex gap-6 shrink-0 h-[380px]">
          {/* Donut Chart */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-[40%] bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col"
          >
            <h3 className="font-poppins font-semibold text-[18px] text-[#1D4735] mb-4">Spending Overview</h3>
            <div className="flex-1 relative flex items-center justify-center">
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="category"
                      stroke="none"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[#6E7A71]">No expense data</p>
              )}
              {categoryStats.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-[13px] text-[#6E7A71] font-medium">Total</span>
                  <span className="text-[22px] font-bold text-[#1D4735]">{formatCurrency(summary.totalExpense)}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Line Chart */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex-1 bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-semibold text-[18px] text-[#1D4735]">Expense Trend</h3>
              <select className="bg-transparent text-[14px] font-medium text-[#6E7A71] outline-none cursor-pointer">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex-1">
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#184734" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#184734" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0ABA4' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0ABA4' }} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      formatter={(value) => [formatCurrency(value), 'Expenses']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#184734" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6E7A71]">No trend data</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 shrink-0"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-poppins font-semibold text-[18px] text-[#1D4735]">Recent Transactions</h3>
            <button className="text-[14px] font-medium text-[#184734] hover:underline">View all</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {transactions.length > 0 ? transactions.map((t, i) => (
              <div key={t._id || i} className="flex items-center justify-between p-3 rounded-[16px] hover:bg-white transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3EB] flex items-center justify-center border border-white">
                    {getCategoryIcon(t.category)}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D4735]">{t.title}</h4>
                    <p className="text-[13px] text-[#6E7A71] mt-0.5">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${t.type === 'income' ? 'text-[#22C55E]' : 'text-[#1D4735]'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#EEF3EB] text-[#A0ABA4] hover:text-[#184734] opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-[#6E7A71] text-center py-4">No transactions yet.</p>
            )}
          </div>
        </motion.div>

      </div>

      {/* RIGHT ANALYTICS PANEL (320px) */}
      <motion.div 
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-[320px] h-full flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar pb-[100px]"
      >
        
        {/* Budget Overview */}
        <div className="bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60">
          <h3 className="font-poppins font-semibold text-[18px] text-[#1D4735] mb-5">Budget Overview</h3>
          {budgets.length > 0 ? (
            <div className="flex flex-col gap-5">
              {budgets.map((b, i) => {
                // Find spent amount from categoryStats
                const spentStat = categoryStats.find(c => c.category === b.category);
                const spent = spentStat ? spentStat.amount : 0;
                const percent = Math.min(100, Math.round((spent / b.limitAmount) * 100));
                const isWarning = percent >= 90;
                
                return (
                  <div key={b._id || i}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-medium text-[#1D4735]">{b.category}</span>
                      <span className="text-[13px] text-[#6E7A71]">{formatCurrency(spent)} / {formatCurrency(b.limitAmount)}</span>
                    </div>
                    <div className="w-full h-2 bg-[#EEF3EB] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${isWarning ? 'bg-[#EF4444]' : 'bg-[#184734]'}`}
                      ></motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
             <p className="text-[#6E7A71] text-sm">No budgets set for this month.</p>
          )}
        </div>

        {/* Recent Goals */}
        <div className="bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-poppins font-semibold text-[18px] text-[#1D4735]">Recent Goals</h3>
            <button className="w-8 h-8 rounded-full bg-[#EEF3EB] flex items-center justify-center text-[#184734] hover:bg-[#184734] hover:text-white transition-colors text-xl leading-none pb-1">+</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {goals.length > 0 ? goals.map((g, i) => {
              const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g._id || i} className="p-4 rounded-[16px] bg-white border border-[rgba(0,0,0,0.03)] hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-[#1D4735]">{g.title}</span>
                    <span className="text-[13px] font-bold" style={{ color: g.color || '#10B981' }}>{percent}%</span>
                  </div>
                  <p className="text-[12px] text-[#6E7A71] mb-3">{formatCurrency(g.currentAmount)} of {formatCurrency(g.targetAmount)}</p>
                  <div className="w-full h-1.5 bg-[#EEF3EB] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: g.color || '#10B981' }}
                    ></motion.div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[#6E7A71] text-sm">No savings goals yet.</p>
            )}
          </div>
        </div>

        {/* Insight Card */}
        <div className="mt-auto relative rounded-[24px] p-6 overflow-hidden bg-[#184734] text-white shadow-xl">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-bl from-[#22C55E] to-transparent opacity-20 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
          <div className="relative z-10">
            <h3 className="font-poppins font-bold text-[20px] mb-2 leading-tight">Stay on track!</h3>
            <p className="text-[14px] text-white/80 leading-relaxed mb-4">
              You're saving more than 85% of users this month. Keep up the great work!
            </p>
            <button className="bg-white text-[#184734] font-semibold text-[14px] px-5 py-2.5 rounded-xl hover:bg-[#EEF3EB] hover:scale-105 transition-all w-full">
              View insights
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Dashboard;

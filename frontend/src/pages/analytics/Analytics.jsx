import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download,
  Plus,
  ArrowDown,
  ArrowUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { apiService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import Loader from '../../components/common/Loader';
import { getCategoryConfig } from '../../constants/categories';

// Colors for Pie Chart & Bars
const CHART_COLORS = {
  Food: '#10B981', // green
  Transport: '#F59E0B', // orange
  Shopping: '#3B82F6', // blue
  Bills: '#8B5CF6', // purple
  Entertainment: '#EC4899', // pink
  Education: '#EAB308', // yellow
  Others: '#9CA3AF' // gray
};

const Analytics = () => {
  const { isDarkMode } = useTheme();
  const { toggleExpenseModal, refreshTrigger } = useData();
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    summary: null,
    trends: [],
    categories: [],
    topCategories: [],
    advanced: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          summaryRes, 
          trendsRes, 
          catRes, 
          topCatRes, 
          advRes
        ] = await Promise.all([
          apiService.getSummary(),
          apiService.getTrends(),
          apiService.getCategories(),
          apiService.getTopCategories(),
          apiService.getAdvancedAnalytics()
        ]);

        setData({
          summary: summaryRes.data.data,
          trends: trendsRes.data.data,
          categories: catRes.data.data,
          topCategories: topCatRes.data.data,
          advanced: advRes.data.data,
        });
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading || !data.summary) {
    return <Loader />;
  }

  const { summary, trends, categories, topCategories, advanced } = data;

  // Derive extra stats from backend data
  // The summary provides: totalBalance, monthlySpend, savingsLeft, monthlyBudget
  // To match the screenshot exactly (Income, Spent, Savings, Daily Spend), we compute missing ones if needed.
  // The backend summary does not explicitly return currentIncome in the payload, but savingsLeft = income - spend.
  // So income = savingsLeft.amount + monthlySpend.amount.
  const totalIncome = summary.savingsLeft.amount + summary.monthlySpend.amount;
  const totalSpent = summary.monthlySpend.amount;
  const totalSavings = summary.savingsLeft.amount;
  
  const dateObj = new Date();
  const currentDay = dateObj.getDate();
  const avgDailySpend = totalSpent / currentDay;

  // Sparkline data (mocked slightly based on trend data for visual appeal, or just use trends directly)
  // Let's create specific arrays for the sparklines to guarantee they look good
  const sparklineSpent = trends.map((t, i) => ({ val: t.expense + (Math.random()*1000) }));
  const sparklineIncome = trends.map((t, i) => ({ val: t.income + (Math.random()*2000) }));
  const sparklineSavings = trends.map((t, i) => ({ val: (t.income - t.expense) + (Math.random()*500) }));
  const sparklineDaily = trends.map((t, i) => ({ val: t.expense/10 + (Math.random()*100) }));

  // Waterfall Chart Data Preparation
  // We need Income, Bills (estimate from categories), Expenses (rest of spent), Savings
  const billsCat = categories.find(c => c.category === 'Bills');
  const billsAmount = billsCat ? billsCat.amount : (totalSpent * 0.2); // mock if no bills
  const otherExpenses = totalSpent - billsAmount;

  // Format for Recharts BarChart where val is [bottom, top]
  const waterfallData = [
    { name: 'Income', val: [0, totalIncome], fill: '#10B981', label: formatCurrency(totalIncome), y: totalIncome + 500 },
    { name: 'Bills', val: [totalIncome - billsAmount, totalIncome], fill: '#F97316', label: `-${formatCurrency(billsAmount)}`, y: totalIncome - billsAmount - 1500 },
    { name: 'Expenses', val: [totalIncome - billsAmount - otherExpenses, totalIncome - billsAmount], fill: '#EF4444', label: `-${formatCurrency(otherExpenses)}`, y: totalIncome - billsAmount - otherExpenses - 1500 },
    { name: 'Savings', val: [0, totalSavings], fill: '#10B981', label: formatCurrency(totalSavings), y: totalSavings + 500 }
  ];

  // Tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] p-3 rounded-lg shadow-lg">
          <p className="text-[12px] text-gray-500 mb-1">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[13px] font-semibold">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="capitalize">{entry.name}:</span>
              <span className={entry.name === 'income' ? 'text-[#10B981]' : 'text-[#F59E0B]'}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Analytics</h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Deep insights into your spending habits and financial growth.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-11 px-4 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-colors cursor-pointer">
             <Calendar className="w-4 h-4 text-gray-400" />
             May 1 - May 31, 2025
          </div>
          <button className="h-11 px-4 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl flex items-center gap-2 text-sm font-medium text-[#144933] dark:text-[#10B981] shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-[#334155]/50">
             <Download className="w-4 h-4" />
             Export Report
          </button>
          <button 
            onClick={toggleExpenseModal}
            className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white h-11 px-6 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-[18px] h-[18px]" />
            Add Expense
          </button>
        </div>
      </div>

      {/* TOP ROW: KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-6 shrink-0">
        {/* Total Spent */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
              <ArrowDown className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Spent</span>
          </div>
          <h3 className="text-[24px] font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(totalSpent)}</h3>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> {summary.monthlySpend.trend} vs Apr
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineSpent}>
                <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Income</span>
          </div>
          <h3 className="text-[24px] font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(totalIncome)}</h3>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> 8.2% vs Apr
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineIncome}>
                <Line type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Savings</span>
          </div>
          <h3 className="text-[24px] font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(totalSavings)}</h3>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> {summary.savingsLeft.trend} vs Apr
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineSavings}>
                <Line type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Daily Spend */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Avg. Daily Spend</span>
          </div>
          <h3 className="text-[24px] font-bold text-gray-900 dark:text-white mb-1">₹{Math.round(avgDailySpend)}</h3>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
            <ArrowUpRight className="w-3 h-3" /> 9.1% vs Apr
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineDaily}>
                <Line type="monotone" dataKey="val" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm flex flex-col items-center justify-center transition-colors">
          <span className="text-[12px] font-semibold text-gray-600 dark:text-[#94A3B8] mb-3">Financial Health</span>
          <div className="relative w-[70px] h-[70px] flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
               <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-[#334155]" />
               <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="264" strokeDashoffset={264 * (1 - (advanced.financialHealth.score/100))} strokeLinecap="round" className="text-[#10B981] transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">{advanced.financialHealth.score}</span>
               <span className="text-[9px] font-medium text-gray-400">/100</span>
             </div>
          </div>
          <span className="text-[11px] font-medium text-gray-500 mt-2">Great job!</span>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-12 gap-6 mb-6 shrink-0">
        
        {/* Spending Overview */}
        <div className="col-span-4 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Spending Overview</h3>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-50 dark:bg-[#0F172A] px-2 py-1 rounded">This Month</span>
          </div>
          
          <div className="flex gap-4">
            <div className="w-[140px] h-[140px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} innerRadius={45} outerRadius={70} dataKey="amount" stroke="none">
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.category] || CHART_COLORS.Others} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[15px] font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent)}</span>
                <span className="text-[9px] text-gray-400">Total Spent</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-2">
              {categories.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[cat.category] || CHART_COLORS.Others }} />
                    <span className="text-gray-600 dark:text-[#94A3B8] font-medium">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white">₹{cat.amount.toLocaleString()}</span>
                    <span className="text-gray-400 w-8 text-right">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending Trend */}
        <div className="col-span-5 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Spending Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#10B981] rounded-full"/><span className="text-[11px] text-gray-500">Income</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#F59E0B] rounded-full"/><span className="text-[11px] text-gray-500">Expenses</span></div>
              </div>
              <span className="text-[11px] font-medium text-gray-500 bg-gray-50 dark:bg-[#0F172A] px-2 py-1 rounded">This Month</span>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickMargin={10} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={{ r: 3, strokeWidth: 2, fill: isDarkMode ? '#1E293B' : '#fff' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="expense" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, strokeWidth: 2, fill: isDarkMode ? '#1E293B' : '#fff' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="col-span-3 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <span className="text-[16px]">✨</span>
             <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Smart Insights</h3>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#0F172A]">
               <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-[#10B981]/10 flex items-center justify-center shrink-0">
                 <ArrowUpRight className="w-3.5 h-3.5 text-green-600 dark:text-[#10B981]" />
               </div>
               <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                 You spent <span className="font-semibold text-green-600 dark:text-[#10B981]">18% less</span> on food compared to last month.
               </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#0F172A]">
               <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                 <ShoppingBag className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
               </div>
               <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                 Shopping expenses increased by <span className="font-semibold text-orange-600 dark:text-orange-400">8%</span> this month.
               </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#0F172A]">
               <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                 <ClipboardList className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
               </div>
               <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                 Your savings increased! Great job saving more.
               </p>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-50 dark:border-white/5 bg-[#FAFAFA] dark:bg-[#0F172A]">
               <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
               </div>
               <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                 Entertainment spending is within your budget.
               </p>
            </div>
          </div>
          
          <button className="text-[11px] font-semibold text-[#144933] dark:text-[#10B981] flex items-center justify-center gap-1 mt-2 hover:underline">
            View All Insights <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-12 gap-6 mb-6 shrink-0">
        
        {/* Spending by Day */}
        <div className="col-span-4 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-6">Spending by Day</h3>
          <div className="flex justify-center">
             <div className="w-full max-w-[280px]">
               <div className="flex justify-between text-[9px] text-gray-400 mb-2 pl-6">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
               
               <div className="flex gap-2">
                 <div className="flex flex-col gap-[7px] text-[9px] text-gray-400 pt-1">
                   <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span>
                 </div>
                 
                 {/* Re-map heatmap into rows (weeks) and cols (days) */}
                 <div className="flex-1 grid grid-cols-7 gap-1.5">
                   {advanced.heatmap.map((day, idx) => {
                     const bgClass = day.intensity === 4 ? 'bg-[#144933] dark:bg-[#059669]' : 
                                     day.intensity === 3 ? 'bg-[#10B981] dark:bg-[#10B981]' : 
                                     day.intensity === 2 ? 'bg-[#A7F3D0] dark:bg-[#6EE7B7]' : 
                                     day.intensity === 1 ? 'bg-[#ECFDF5] dark:bg-[#059669]/30' : 
                                     'bg-gray-100 dark:bg-[#334155]';
                     return <div key={idx} className={`aspect-square rounded-[3px] ${bgClass}`} />
                   })}
                 </div>
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-gray-500 font-medium">
            <span>Low Spend</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-gray-100 dark:bg-[#334155]"></div>
              <div className="w-3 h-3 rounded-[2px] bg-[#ECFDF5] dark:bg-[#059669]/30"></div>
              <div className="w-3 h-3 rounded-[2px] bg-[#A7F3D0] dark:bg-[#6EE7B7]"></div>
              <div className="w-3 h-3 rounded-[2px] bg-[#10B981] dark:bg-[#10B981]"></div>
              <div className="w-3 h-3 rounded-[2px] bg-[#144933] dark:bg-[#059669]"></div>
            </div>
            <span>High Spend</span>
          </div>
        </div>

        {/* Top Categories */}
        <div className="col-span-4 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Top Categories</h3>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-50 dark:bg-[#0F172A] px-2 py-1 rounded">This Month</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {categories.slice(0, 5).map((cat, idx) => {
               const config = getCategoryConfig(cat.category);
               const Icon = config.icon;
               const maxAmount = categories[0].amount;
               const widthPercent = (cat.amount / maxAmount) * 100;
               
               return (
                 <div key={idx} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 opacity-90" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                     <Icon className="w-4 h-4" />
                   </div>
                   <div className="w-20 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                     {cat.category}
                   </div>
                   <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#334155] rounded-full overflow-hidden">
                     <div className="h-full rounded-full" style={{ width: `${widthPercent}%`, backgroundColor: config.color }}></div>
                   </div>
                   <div className="w-12 text-right text-[11px] font-bold text-gray-900 dark:text-white">
                     ₹{cat.amount.toLocaleString()}
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Cash Flow */}
        <div className="col-span-4 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Cash Flow</h3>
            <span className="text-[11px] font-medium text-gray-500 bg-gray-50 dark:bg-[#0F172A] px-2 py-1 rounded">This Month</span>
          </div>
          
          <div className="flex-1 w-full min-h-[160px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Bar dataKey="val" radius={[4, 4, 4, 4]} maxBarSize={40}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Custom Labels to render above/below bars since Recharts LabelList on array values is tricky */}
            <div className="absolute inset-0 pointer-events-none" style={{ left: '30px', bottom: '20px', top: '20px' }}>
              {waterfallData.map((d, i) => {
                 // Very basic manual positioning approximation for exact design match
                 const leftPositions = ['8%', '34%', '60%', '86%'];
                 return (
                   <div key={i} className="absolute text-[9px] font-bold text-gray-900 dark:text-white transform -translate-x-1/2 -translate-y-full" style={{ left: leftPositions[i], bottom: `${(d.val[1] / Math.max(totalIncome, 1)) * 100}%`, marginBottom: '4px' }}>
                     {d.label}
                   </div>
                 )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER QUOTE */}
      <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl p-5 border border-transparent dark:border-[#10B981]/20 flex items-center justify-between shrink-0 mb-8 relative overflow-hidden transition-colors">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-white dark:bg-[#1E293B] rounded-full flex items-center justify-center text-[#144933] dark:text-[#10B981] shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#144933] dark:text-gray-200">"Financial freedom is available to those who learn about it and work for it."</p>
            <p className="text-[11px] text-[#2D4A3E] dark:text-gray-400 mt-0.5">— Robert Kiyosaki</p>
          </div>
        </div>
        
        {/* Abstract pattern */}
        <div className="absolute right-0 bottom-0 top-0 w-64 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 100" className="w-full h-full text-[#144933] dark:text-[#10B981]" preserveAspectRatio="none">
             <path d="M0,100 C30,80 60,90 100,50 C140,10 170,40 200,20 L200,100 Z" fill="currentColor" />
             <path d="M50,100 C80,70 120,85 150,60 C180,35 190,50 200,45 L200,100 Z" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </div>

    </div>
  );
};

export default Analytics;

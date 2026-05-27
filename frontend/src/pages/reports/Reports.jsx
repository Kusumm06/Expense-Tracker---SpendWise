import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Bell, 
  Download, 
  ChevronRight, 
  PieChart as PieChartIcon, 
  BarChart2, 
  TrendingUp, 
  Wallet, 
  Target, 
  ShieldCheck,
  Calendar,
  FileText,
  Loader2,
  FileBox
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { getCategoryConfig } from '../../constants/categories';

const CHART_COLORS = {
  Food: '#10B981',
  Transport: '#F59E0B',
  Shopping: '#3B82F6',
  Bills: '#8B5CF6',
  Entertainment: '#EC4899',
  Education: '#EAB308',
  Others: '#9CA3AF'
};

const Reports = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [period, setPeriod] = useState('this_month');
  const [reportType, setReportType] = useState('Monthly Summary');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const getInitials = (name) => {
    if (!name) return 'AM';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  // Fetch data automatically when period changes
  useEffect(() => {
    fetchReportData();
  }, [period]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getReports(period);
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load report data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    fetchReportData();
    toast.success('Report updated successfully.');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleDownloadPDF = () => {
    if (!reportData) return toast.error('No data to export.');
    
    toast.success('Generating PDF Report...');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(20, 73, 51); // SpendWise Green #144933
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('SpendWise', 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Financial Report', pageWidth - 14, 25, { align: 'right' });
    
    // User Info & Summary
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`User: ${user?.name || 'User'}`, 14, 55);
    doc.text(`Period: ${period.replace('_', ' ').toUpperCase()}`, 14, 62);
    
    // Summary Cards
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Income: ${formatCurrency(reportData.summary.totalIncome)}`, 14, 75);
    doc.text(`Total Expenses: ${formatCurrency(reportData.summary.totalExpense)}`, 14, 82);
    doc.text(`Total Savings: ${formatCurrency(reportData.summary.totalSavings)}`, 14, 89);
    doc.text(`Remaining Budget: ${formatCurrency(Math.max(0, reportData.summary.totalBudget - reportData.summary.totalExpense))}`, 14, 96);
    
    // Transactions Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Transaction History', 14, 115);
    
    const tableColumn = ["Date", "Title", "Category", "Type", "Amount"];
    const tableRows = [];
    
    reportData.transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      const amountStr = (t.type === 'expense' ? '-' : '+') + formatCurrency(t.amount);
      tableRows.push([date, t.title, t.category, t.type.toUpperCase(), amountStr]);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 120,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [20, 73, 51], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    doc.save(`SpendWise_Report_${period}.pdf`);
    toast.success('PDF downloaded successfully.');
  };

  const handleDownloadCSV = () => {
    if (!reportData || !reportData.transactions.length) return toast.error('No data to export.');
    
    toast.success('Generating CSV Report...');
    const csvData = reportData.transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Title: t.title,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      Description: t.description || ''
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SpendWise_Transactions_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully.');
  };

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2 max-w-5xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Reports</h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Generate, view, and download your financial reports.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0F172A]"></span>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-[#EEF5ED] dark:bg-[#10B981]/20 flex items-center justify-center text-[#144933] dark:text-[#10B981] font-bold text-[14px]">
            {initials}
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 shrink-0 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row flex-1 gap-6">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-gray-500 dark:text-[#94A3B8] mb-2">Report Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-[#64748B]" />
                </div>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#144933]/20 transition-all cursor-pointer"
                >
                  <option>Monthly Summary</option>
                  <option>Expense Breakdown</option>
                  <option>Income vs Expense</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#64748B] rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-gray-500 dark:text-[#94A3B8] mb-2">Date Range</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-[#64748B]" />
                </div>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#144933]/20 transition-all cursor-pointer"
                >
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year</option>
                  <option value="all_time">All Time</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#64748B] rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 md:mb-px flex-1 md:flex-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <TrendingUp className="w-[18px] h-[18px]" />}
              Generate Report
            </button>
            
            <div className="relative group flex-1 md:flex-none">
              <button 
                disabled={loading || !reportData}
                className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] text-[#144933] dark:text-[#10B981] hover:bg-gray-50 dark:hover:bg-[#334155]/50 px-6 py-3 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center justify-center gap-2 w-full disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Download className="w-[18px] h-[18px]" />
                Download
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-100 dark:border-[#334155] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-2">
                <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" /> Download PDF
                </button>
                <button onClick={handleDownloadCSV} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-colors flex items-center gap-2">
                  <FileBox className="w-4 h-4 text-green-500" /> Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-[#144933] dark:text-[#10B981] mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Generating your report...</p>
        </div>
      ) : !reportData || reportData.transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-[#334155]">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#0F172A] rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2">No reports available yet.</h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 max-w-sm text-center">There are no transactions recorded for the selected date range. Try selecting a different period.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm">
              <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Income</span>
              <h3 className="text-[22px] font-bold text-[#10B981] mt-1">{formatCurrency(reportData.summary.totalIncome)}</h3>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm">
              <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Expenses</span>
              <h3 className="text-[22px] font-bold text-red-500 mt-1">{formatCurrency(reportData.summary.totalExpense)}</h3>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm">
              <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Total Savings</span>
              <h3 className="text-[22px] font-bold text-blue-500 mt-1">{formatCurrency(reportData.summary.totalSavings)}</h3>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm">
              <span className="text-[13px] font-medium text-gray-500 dark:text-[#94A3B8]">Remaining Budget</span>
              <h3 className="text-[22px] font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(Math.max(0, reportData.summary.totalBudget - reportData.summary.totalExpense))}
              </h3>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Trend Chart */}
            <div className="col-span-8 bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-6">Income vs Expenses Trend</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.trends} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [formatCurrency(value)]}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="col-span-4 bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm flex flex-col">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">Category Breakdown</h3>
              <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportData.categories} innerRadius={50} outerRadius={80} dataKey="amount" stroke="none">
                      {reportData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.category] || CHART_COLORS.Others} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[16px] font-bold text-gray-900 dark:text-white">{formatCurrency(reportData.summary.totalExpense)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                {reportData.categories.slice(0, 4).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[cat.category] || CHART_COLORS.Others }} />
                      <span className="text-gray-600 dark:text-[#94A3B8] font-medium">{cat.category}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RECENT TRANSACTIONS PREVIEW */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Transaction Preview</h3>
              <span className="text-[12px] text-gray-500 font-medium">{reportData.transactions.length} total transactions in period</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#334155] text-gray-500 dark:text-[#94A3B8]">
                    <th className="pb-3 font-medium px-2">Date</th>
                    <th className="pb-3 font-medium px-2">Title</th>
                    <th className="pb-3 font-medium px-2">Category</th>
                    <th className="pb-3 font-medium px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#334155]/50">
                  {reportData.transactions.slice(0, 5).map((t, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#0F172A]/30 transition-colors">
                      <td className="py-3 px-2 text-gray-500 dark:text-[#94A3B8]">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{t.title}</td>
                      <td className="py-3 px-2 text-gray-500 dark:text-[#94A3B8]">{t.category}</td>
                      <td className={`py-3 px-2 text-right font-bold ${t.type === 'income' ? 'text-[#10B981]' : 'text-gray-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.transactions.length > 5 && (
                <div className="text-center pt-4 mt-2 border-t border-gray-50 dark:border-[#334155]/50">
                  <span className="text-[12px] text-gray-400">Download report to view all {reportData.transactions.length} transactions.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* FOOTER */}
      {!loading && reportData && reportData.transactions.length > 0 && (
        <div className="mt-8 bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl p-6 border border-transparent dark:border-[#10B981]/20 flex items-center gap-4 shrink-0 mb-8 transition-colors">
          <div className="w-10 h-10 rounded-full border-2 border-[#144933] dark:border-[#10B981] flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0 bg-transparent">
             <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-[#144933] dark:text-white mb-0.5">Your data is secure</h4>
            <p className="text-[12px] text-gray-600 dark:text-[#94A3B8]">All reports are generated from your data and are 100% private. Downloads are generated locally on your device.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;

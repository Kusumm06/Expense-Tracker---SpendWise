import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Bell, 
  Download, 
  ChevronRight, 
  PieChart, 
  BarChart2, 
  TrendingUp, 
  Wallet, 
  Target, 
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuth();
  
  // Extract initials for the avatar badge
  const getInitials = (name) => {
    if (!name) return 'AM'; // fallback to AM as per screenshot
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  const popularReports = [
    {
      id: 1,
      title: 'Monthly Summary',
      description: 'Overview of income, expenses and savings for the selected month.',
      icon: PieChart
    },
    {
      id: 2,
      title: 'Expense Breakdown',
      description: 'Detailed breakdown of expenses by category.',
      icon: BarChart2
    },
    {
      id: 3,
      title: 'Income vs Expense',
      description: 'Compare your income and expenses over time.',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'Category Report',
      description: 'Spending and statistics for a specific category.',
      icon: Wallet
    },
    {
      id: 5,
      title: 'Goal Progress',
      description: 'Progress and summary of your financial goals.',
      icon: Target
    }
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Summary – May 2025', date: 'May 31, 2025' },
    { id: 2, name: 'Expense Breakdown – May 2025', date: 'May 31, 2025' },
    { id: 3, name: 'Income vs Expense – Apr 2025', date: 'Apr 30, 2025' },
    { id: 4, name: 'Category Report – Food & Dining', date: 'Apr 28, 2025' },
    { id: 5, name: 'Goal Progress Report', date: 'Apr 28, 2025' }
  ];

  const handleGenerate = () => {
    toast.success('Report generation started. This will take a moment.');
  };

  const handleDownload = (name) => {
    toast.success(`Downloading ${name}...`);
  };

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2 max-w-4xl mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Reports</h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Generate and download your financial reports.</p>
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

      {/* GENERATE REPORT CARD */}
      <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-6 sm:p-8 shadow-sm mb-10 shrink-0 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row flex-1 gap-6">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-gray-500 dark:text-[#94A3B8] mb-2">Report Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-[#64748B]" />
                </div>
                <select className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#144933]/20 transition-all">
                  <option>Monthly Summary</option>
                  <option>Expense Breakdown</option>
                  <option>Income vs Expense</option>
                  <option>Category Report</option>
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
                <select className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#144933]/20 transition-all">
                  <option>May 2025</option>
                  <option>April 2025</option>
                  <option>March 2025</option>
                  <option>Custom Range</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#64748B] rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 md:mb-px w-full md:w-auto"
          >
            <Download className="w-[18px] h-[18px]" />
            Generate Report
          </button>
        </div>
      </div>

      {/* POPULAR REPORTS */}
      <div className="mb-10 shrink-0">
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-6">Popular Reports</h3>
        
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl shadow-sm transition-colors overflow-hidden flex flex-col divide-y divide-gray-50 dark:divide-[#334155]/50">
          {popularReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#EEF5ED] dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                  <report.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white mb-0.5">{report.title}</h4>
                  <p className="text-[12px] text-gray-500 dark:text-[#94A3B8]">{report.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* RECENT REPORTS */}
      <div className="mb-10 shrink-0">
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-6">Recent Reports</h3>
        
        <div className="w-full">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 dark:border-[#334155] px-2 text-[12px] font-medium text-gray-500 dark:text-[#94A3B8]">
            <div className="col-span-7 sm:col-span-6">Report Name</div>
            <div className="col-span-5 sm:col-span-4 text-left">Date Generated</div>
            <div className="hidden sm:block col-span-2 text-right">Action</div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col divide-y divide-gray-50 dark:divide-[#334155]/30">
            {recentReports.map((report) => (
              <div key={report.id} className="grid grid-cols-12 gap-4 py-4 px-2 items-center hover:bg-gray-50 dark:hover:bg-[#0F172A]/30 rounded-lg transition-colors -mx-2">
                <div className="col-span-7 sm:col-span-6 text-[13px] font-semibold text-gray-900 dark:text-white">
                  {report.name}
                </div>
                <div className="col-span-5 sm:col-span-4 text-[13px] text-gray-500 dark:text-[#94A3B8]">
                  {report.date}
                </div>
                <div className="hidden sm:flex col-span-2 justify-end">
                  <button 
                    onClick={() => handleDownload(report.name)}
                    className="p-2 text-[#10B981] hover:bg-[#EEF5ED] dark:hover:bg-[#10B981]/10 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Mobile action button (appears under date on very small screens, or hidden if tight) */}
                <div className="col-span-12 flex sm:hidden justify-end -mt-8 pointer-events-none">
                  <button 
                    onClick={() => handleDownload(report.name)}
                    className="p-2 text-[#10B981] pointer-events-auto"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CARD */}
      <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl p-6 border border-transparent dark:border-[#10B981]/20 flex items-center gap-4 shrink-0 mb-8 transition-colors">
        <div className="w-10 h-10 rounded-full border-2 border-[#144933] dark:border-[#10B981] flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0 bg-transparent">
           <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-[#144933] dark:text-white mb-0.5">Your data is secure</h4>
          <p className="text-[12px] text-gray-600 dark:text-[#94A3B8]">All reports are generated from your data and are 100% private.</p>
        </div>
      </div>

    </div>
  );
};

export default Reports;

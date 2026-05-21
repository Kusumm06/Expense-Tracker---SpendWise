import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart2,
  PieChart,
  Target,
  FileText,
  User,
  Settings,
  Search,
  Bell,
  Plus,
  Moon,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { useData } from '../context/DataContext';
import AddExpenseModal from '../components/common/AddExpenseModal';
import AddGoalModal from '../components/common/AddGoalModal';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toggleExpenseModal } = useData();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Budgets', icon: PieChart, path: '/budgets' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Helper to determine greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#FAFAFA] dark:bg-[#0F172A] transition-colors duration-300">

      {/* SIDEBAR */}
      <div className="w-[280px] h-full bg-white dark:bg-[#1E293B] border-r border-[#F0F0F0] dark:border-[#334155] flex flex-col px-6 py-8 shrink-0 z-20 transition-colors duration-300">

        {/* Branding */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-[#144933] dark:bg-[#10B981] rounded-full flex items-center justify-center">
            {/* Custom logo shape resembling the image */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19V5C4 4.44772 4.44772 4 5 4H19" />
              <path d="M14 14C14 16.2091 12.2091 18 10 18C7.79086 18 6 16.2091 6 14C6 11.7909 7.79086 10 10 10" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-[22px] text-[#144933] dark:text-white leading-none transition-colors">SpendWise</h1>
            <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] mt-1 font-medium transition-colors">Smart tracking. Better living.</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path) || (item.name === 'Dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                className="block group"
              >
                <div className={`h-[48px] rounded-xl px-4 flex items-center gap-4 transition-all duration-200 ${isActive ? 'bg-[#EEF5ED] dark:bg-[#10B981]/10 text-[#144933] dark:text-[#10B981]' : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#334155]/50 hover:text-[#144933] dark:hover:text-white'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#144933] dark:text-[#10B981]' : 'text-[#6B7280] dark:text-[#94A3B8] group-hover:text-[#144933] dark:group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[15px] font-medium ${isActive ? 'text-[#144933] dark:text-[#10B981]' : 'text-[#6B7280] dark:text-[#94A3B8] group-hover:text-[#144933] dark:group-hover:text-white'}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-6">
          
          {/* Motivation Card */}
          <div className="w-full rounded-2xl p-5 relative overflow-hidden bg-[#2D4A3E] dark:bg-[#10B981]/20 border border-transparent dark:border-[#10B981]/20 text-white transition-colors">
            <div className="relative z-10 w-[70%]">
              <h3 className="font-medium text-[15px] leading-snug mb-4 dark:text-[#10B981]">Small steps today, big freedom tomorrow.</h3>
            </div>
            <div className="absolute bottom-0 right-2 opacity-90 text-[40px]">
               🌱
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3 text-[#6B7280] dark:text-[#94A3B8]">
              <Moon className="w-5 h-5" />
              <span className="text-[14px] font-medium">Dark Mode</span>
            </div>
            {/* Toggle switch */}
            <div 
              onClick={toggleTheme}
              className={`w-10 h-6 rounded-full relative cursor-pointer flex items-center transition-colors ${isDarkMode ? 'bg-[#10B981]' : 'bg-[#4B5563]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#F0F0F0] dark:border-[#334155] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#334155]/50 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                alt="Profile" 
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#1F2937] dark:text-white transition-colors">{user?.name || 'Alex Morgan'}</span>
                <span className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] transition-colors">{user?.email || 'alexmorgan@gmail.com'}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF] dark:text-[#64748B]" />
          </div>

        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* TOP HEADER */}
        <header className="h-[100px] px-8 flex items-center justify-between shrink-0 bg-[#FAFAFA] dark:bg-[#0F172A] z-10 pt-4 transition-colors duration-300">
          <div>
            <h2 className="font-poppins font-semibold text-[28px] text-[#144933] dark:text-white tracking-tight transition-colors">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Alex'}! 👋
            </h2>
            <p className="text-[15px] text-[#6B7280] dark:text-[#94A3B8] mt-1 transition-colors">Here's your financial overview for today.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF] dark:text-[#64748B]" />
              <input
                type="text"
                placeholder="Search something..."
                className="w-[300px] h-11 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl pl-11 pr-12 text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#144933] dark:focus:ring-[#10B981] shadow-sm transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 dark:bg-[#0F172A] px-1.5 py-0.5 rounded text-[11px] text-gray-500 dark:text-[#94A3B8] font-medium transition-colors">
                <span className="text-[10px]">⌘</span> K
              </div>
            </div>

            {/* Notification */}
            <button className="relative text-[#4B5563] dark:text-[#94A3B8] hover:text-[#144933] dark:hover:text-[#10B981] transition-colors">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FAFAFA] dark:border-[#0F172A] transition-colors"></span>
            </button>

            {/* Add Expense Button */}
            <button 
              onClick={toggleExpenseModal}
              className="flex items-center gap-2 bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white h-11 px-5 rounded-full font-medium text-[14px] transition-colors shadow-sm"
            >
              <Plus className="w-[18px] h-[18px]" />
              Add Expense
            </button>

            {/* Profile Image */}
            <button className="ml-2">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                alt="Profile" 
                className="w-11 h-11 rounded-full border border-gray-200 shadow-sm"
              />
            </button>
          </div>
        </header>

        {/* MAIN OUTLET */}
        <div className="flex-1 overflow-hidden relative px-8 pb-8">
          <Outlet />
        </div>

      </div>
      
      {/* Modals */}
      <AddExpenseModal />
      <AddGoalModal />

    </div>
  );
};

export default MainLayout;

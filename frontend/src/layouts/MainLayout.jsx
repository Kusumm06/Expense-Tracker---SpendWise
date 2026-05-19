import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Tags,
  PieChart,
  Target,
  FileText,
  LineChart,
  Calendar,
  Settings,
  Search,
  Bell,
  LogOut
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
    { name: 'Categories', icon: Tags, path: '/categories' },
    { name: 'Budgets', icon: PieChart, path: '/budgets' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Insights', icon: LineChart, path: '/insights' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans" style={{ background: 'linear-gradient(135deg, #F5F8F3 0%, #EEF3EB 100%)' }}>

      {/* SIDEBAR */}
      <div className="w-[280px] h-full bg-[rgba(255,255,255,0.75)] backdrop-blur-[18px] border-r border-[rgba(0,0,0,0.04)] flex flex-col p-[28px] shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

        {/* Branding */}
        <div className="flex items-center gap-3 mb-[40px]">
          <div className="w-[42px] h-[42px] bg-[#184734] rounded-full flex items-center justify-center shadow-md">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-[24px] text-[#184734] leading-none">SpendWise</h1>
            <p className="text-[12px] text-[#6E7A71] mt-0.5 font-medium tracking-wide">Smart tracking. Better living.</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className="block relative group"
              >
                <div className={`h-[58px] rounded-[16px] px-[18px] flex items-center gap-[14px] transition-all duration-300 ${isActive ? 'bg-[#EEF5ED] shadow-sm' : 'hover:bg-[#EEF5ED]/50 hover:scale-[1.02]'}`}>
                  <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#184734]' : 'text-[#6E7A71] group-hover:text-[#184734]'}`} />
                  <span className={`text-[16px] font-medium transition-colors duration-300 ${isActive ? 'text-[#184734]' : 'text-[#6E7A71] group-hover:text-[#184734]'}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Motivation Card */}
        <div className="mt-6 w-full h-[220px] rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EAF2E7 0%, #DCE9DC 100%)' }}>
          <div className="relative z-10">
            <Target className="w-8 h-8 text-[#184734] mb-3 opacity-80" />
            <h3 className="font-semibold text-[#184734] text-[18px] leading-tight">Goal progress</h3>
            <p className="text-[14px] text-[#215C45] mt-1 font-medium">You're doing great!</p>
          </div>
          <button className="relative z-10 w-full h-[46px] bg-white/60 hover:bg-white/90 text-[#184734] font-medium rounded-[14px] transition-colors shadow-sm backdrop-blur-sm">
            View goals
          </button>
          {/* Abstract decoration */}
          <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 flex items-center justify-center gap-3 w-full h-[54px] rounded-[16px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>

      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* TOP HEADER */}
        <header className="h-[90px] px-[40px] flex items-center justify-between shrink-0 relative z-10">
          <div>
            <h2 className="font-poppins font-bold text-[36px] text-[#1D4735] tracking-tight">Good morning, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
            <p className="font-inter text-[16px] text-[#6E7A71] mt-0.5">Here's what's happening with your finances today.</p>
          </div>

          <div className="flex items-center gap-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5 h-5 text-[#8DA57B]" />
              <input
                type="text"
                placeholder="Search transactions, categories..."
                className="w-[420px] h-[56px] bg-[rgba(255,255,255,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.5)] rounded-[18px] pl-[52px] pr-4 text-[16px] text-[#1F3F31] placeholder:text-[#8DA57B] focus:outline-none focus:ring-2 focus:ring-[#8DA57B]/30 focus:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all"
              />
            </div>

            {/* Notification */}
            <button className="w-[56px] h-[56px] rounded-[18px] bg-[rgba(255,255,255,0.85)] backdrop-blur-md flex items-center justify-center text-[#1D4735] hover:bg-white hover:shadow-md transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-[14px] right-[14px] w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Dropdown */}
            <button className="flex items-center gap-3 bg-[rgba(255,255,255,0.85)] backdrop-blur-md h-[56px] px-4 rounded-[18px] hover:bg-white hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#184734] to-[#8DA57B] flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="font-medium text-[#1D4735] mr-1">{user?.name || 'User'}</span>
            </button>
          </div>
        </header>

        {/* MAIN OUTLET */}
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default MainLayout;

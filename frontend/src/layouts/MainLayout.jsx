import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
import AddIncomeModal from '../components/common/AddIncomeModal';
import AddGoalModal from '../components/common/AddGoalModal';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toggleExpenseModal, toggleIncomeModal } = useData();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      import('../services/api').then(({ apiService }) => {
        apiService.getNotifications()
          .then(res => {
            if (res.data.success) {
              setNotifications(res.data.data);
              setUnreadCount(res.data.data.filter(n => !n.isRead).length);
            }
          })
          .catch(err => console.error("Failed to load notifications", err));
      });
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const { apiService } = await import('../services/api');
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

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
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center justify-between mt-2 pt-4 border-t border-[#F0F0F0] dark:border-[#334155] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#334155]/50 p-2 rounded-xl transition-all"
          >
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

            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative text-[#4B5563] dark:text-[#94A3B8] hover:text-[#144933] dark:hover:text-[#10B981] transition-colors"
              >
                <Bell className="w-[22px] h-[22px]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FAFAFA] dark:border-[#0F172A] transition-colors"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-[350px] bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-[#334155] flex justify-between items-center">
                      <h3 className="font-semibold text-[#1F2937] dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[12px] bg-[#EEF5ED] text-[#144933] dark:bg-[#10B981]/10 dark:text-[#10B981] px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-[#94A3B8] text-[13px]">
                          You have no notifications.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                            className={`p-4 border-b border-gray-50 dark:border-[#334155]/50 hover:bg-gray-50 dark:hover:bg-[#334155]/50 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-gray-50/50 dark:bg-[#0F172A]/30' : ''}`}
                          >
                            <div className="mt-1">
                              {notif.type === 'alert' ? <div className="w-2 h-2 rounded-full bg-red-500"></div> : 
                               notif.type === 'warning' ? <div className="w-2 h-2 rounded-full bg-orange-500"></div> :
                               <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-[13px] font-medium ${!notif.isRead ? 'text-[#1F2937] dark:text-white' : 'text-gray-600 dark:text-[#94A3B8]'}`}>
                                {notif.title}
                              </h4>
                              <p className="text-[12px] text-gray-500 dark:text-[#64748B] mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-gray-400 dark:text-[#64748B] mt-2 block">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Income Button */}
            <button 
              onClick={toggleIncomeModal}
              className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] text-[#144933] dark:text-[#10B981] hover:bg-gray-50 dark:hover:bg-[#334155]/50 h-11 px-5 rounded-full font-medium text-[14px] transition-colors shadow-sm"
            >
              <Plus className="w-[18px] h-[18px]" />
              Add Income
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
            <button className="ml-2 transition-transform hover:scale-105" onClick={() => navigate('/profile')}>
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
      <AddIncomeModal />
      <AddGoalModal />

    </div>
  );
};

export default MainLayout;

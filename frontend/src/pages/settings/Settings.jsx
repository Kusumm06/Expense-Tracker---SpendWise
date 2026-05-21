import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  Settings2, 
  ShieldCheck, 
  FileText, 
  Info,
  ChevronRight,
  AtSign,
  Mail,
  Phone,
  Camera,
  Star,
  LogOut,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  // Toggles state
  const [toggles, setToggles] = useState({
    transactionAlerts: true,
    budgetAlerts: true,
    goalReminders: true,
    weeklySummary: true,
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'privacy', label: 'Data & Privacy', icon: FileText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Adjust scroll position to account for any sticky headers or padding
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentAvatar = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=eef5ed`;

  const NavItem = ({ item }) => {
    const isActive = activeSection === item.id;
    const Icon = item.icon;
    return (
      <button
        onClick={() => scrollToSection(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
          isActive 
            ? 'bg-[#EEF5ED] dark:bg-[#10B981]/10 text-[#144933] dark:text-[#10B981] font-semibold' 
            : 'text-gray-600 dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-[#1E293B] font-medium'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#144933] dark:text-[#10B981]' : 'text-gray-400 dark:text-[#64748B]'}`} />
        <span className="text-[14px]">{item.label}</span>
      </button>
    );
  };

  // Custom Toggle Switch
  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${checked ? 'bg-[#144933] dark:bg-[#10B981]' : 'bg-gray-200 dark:bg-[#334155]'}`}
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
        style={{ x: checked ? 20 : 0 }}
      />
    </button>
  );

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2 max-w-[1200px] mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Settings</h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Manage your preferences and account configurations.</p>
        </div>
        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0F172A]"></span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-10">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-[240px] shrink-0">
          <div className="sticky top-0 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* PROFILE SETTINGS */}
          <div id="profile" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Profile Settings</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">Manage your personal information and how it appears on SpendWise.</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="px-5 py-2 border border-gray-200 dark:border-[#334155] text-[#144933] dark:text-[#10B981] font-medium text-[13px] rounded-xl hover:bg-gray-50 dark:hover:bg-[#334155]/50 transition-colors shrink-0"
              >
                Edit Profile
              </button>
            </div>

            <div className="flex flex-col">
              <div onClick={() => navigate('/profile')} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-[#334155]/50 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-0.5">Full Name</h4>
                    <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">{user?.name || 'Alex Morgan'}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div onClick={() => navigate('/profile')} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-[#334155]/50 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-0.5">Username</h4>
                    <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">@alexmorgan</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div onClick={() => navigate('/profile')} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-[#334155]/50 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-0.5">Email Address</h4>
                    <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">{user?.email || 'alexmorgan@gmail.com'}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div onClick={() => navigate('/profile')} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-[#334155]/50 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-0.5">Phone Number</h4>
                    <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">+91 98765 43210</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div onClick={() => navigate('/profile')} className="flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 cursor-pointer transition-colors px-2 rounded-lg -mx-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-gray-900 dark:text-white mb-0.5">Profile Avatar</h4>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mt-1">
                      <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover scale-110" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PREFERENCES */}
          <div id="preferences" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                 <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Preferences</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">Customize your app experience.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[12px] font-semibold text-gray-900 dark:text-white mb-2">Currency</label>
                <select className="w-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] text-gray-900 dark:text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-900 dark:text-white mb-2">Language</label>
                <select className="w-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] text-gray-900 dark:text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-900 dark:text-white mb-2">Date Format</label>
                <select className="w-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] text-gray-900 dark:text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20">
                  <option>DD MMM YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-900 dark:text-white mb-2">Start Week On</label>
                <select className="w-full bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] text-gray-900 dark:text-white text-[13px] px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20">
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div id="notifications" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5ED] dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                 <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Notifications</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">Choose what you want to be notified about.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Transaction Alerts</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] leading-tight mb-4">Get notified for new transactions</p>
                </div>
                <ToggleSwitch checked={toggles.transactionAlerts} onChange={() => handleToggle('transactionAlerts')} />
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Budget Alerts</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] leading-tight mb-4">When budget limit is near</p>
                </div>
                <ToggleSwitch checked={toggles.budgetAlerts} onChange={() => handleToggle('budgetAlerts')} />
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Goal Reminders</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] leading-tight mb-4">Reminders for your goals</p>
                </div>
                <ToggleSwitch checked={toggles.goalReminders} onChange={() => handleToggle('goalReminders')} />
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Weekly Summary</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] leading-tight mb-4">Receive weekly summaries</p>
                </div>
                <ToggleSwitch checked={toggles.weeklySummary} onChange={() => handleToggle('weeklySummary')} />
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div id="security" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Security</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">Manage your account security and access.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-[#334155]">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity pt-2 md:pt-0">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Change Password</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Update your password</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity pt-4 md:pt-0 md:px-6">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Add extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-gray-900 dark:text-white">Off</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity pt-4 md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Active Sessions</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Manage your active sessions</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* DATA & PRIVACY */}
          <div id="privacy" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0 border border-gray-100 dark:border-[#334155]">
                 <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Data & Privacy</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">Manage your data and privacy preferences.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-[#334155]">
              <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity pt-2 md:pt-0">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Export Data</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Download a copy of your data</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between cursor-pointer hover:opacity-70 transition-opacity pt-4 md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">Delete Account</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Permanently delete your account</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* ABOUT SPENDWISE */}
          <div id="about" className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors scroll-mt-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5ED] dark:bg-[#10B981]/10 flex items-center justify-center text-[#144933] dark:text-[#10B981] shrink-0">
                 <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">About SpendWise</h3>
                <p className="text-[13px] text-gray-500 dark:text-[#94A3B8]">App information and legal.</p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 px-2 rounded-lg -mx-2 transition-colors">
                <span className="text-[13px] font-bold text-gray-900 dark:text-white">App Version</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 px-2 rounded-lg -mx-2 transition-colors">
                <span className="text-[13px] font-bold text-gray-900 dark:text-white">Terms of Service</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 px-2 rounded-lg -mx-2 transition-colors">
                <span className="text-[13px] font-bold text-gray-900 dark:text-white">Privacy Policy</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]/50 px-2 rounded-lg -mx-2 transition-colors">
                <span className="text-[13px] font-bold text-gray-900 dark:text-white">Rate Us</span>
                <div className="flex gap-1 text-[#10B981]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <div 
            onClick={logout}
            className="bg-[#FEF2F2] dark:bg-red-900/10 border border-transparent dark:border-red-900/20 rounded-3xl p-6 shadow-sm flex items-center justify-between cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2"
          >
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                 <LogOut className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="text-[14px] font-bold text-red-600 dark:text-red-500 mb-0.5">Logout</h4>
                 <p className="text-[12px] text-gray-500 dark:text-red-400/80">Sign out from your account</p>
               </div>
             </div>
             <ChevronRight className="w-5 h-5 text-red-400" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;

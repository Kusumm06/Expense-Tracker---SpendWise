import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { 
  Mail, 
  Calendar, 
  Phone, 
  Camera, 
  Copy, 
  Edit3, 
  Check, 
  ChevronRight,
  LogOut,
  Trash2,
  Bell,
  Sun,
  Moon,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Dummy data for form states
  const [formData, setFormData] = useState({
    username: 'alexmorgan',
    fullName: user?.name || 'Alex Morgan',
    email: user?.email || 'alexmorgan@gmail.com',
    phone: '98765 43210',
    countryCode: '+91',
    bio: 'Saving today for a better tomorrow.'
  });

  const [preferences, setPreferences] = useState({
    currency: 'INR (₹)',
    monthlyReminder: true,
    weeklyInsights: true,
    marketingEmails: false
  });

  const [activeAvatar, setActiveAvatar] = useState(1);

  // Generate 14 random dicebear avatars for the grid
  const avatars = Array.from({ length: 14 }).map((_, i) => 
    `https://api.dicebear.com/7.x/adventurer/svg?seed=Avatar${i + 1}&backgroundColor=eef5ed,c6eccc,fef3e1,e8f0fe,f3e8fd`
  );
  // Add a specific one for the active one to look good
  avatars[1] = `https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=eef5ed`;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(`@${formData.username}`);
    toast.success('Username copied!');
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentAvatar = user?.avatar || avatars[1];

  return (
    <div className="h-full flex flex-col pt-6 pb-2 overflow-y-auto custom-scrollbar pr-2 max-w-[1200px] mx-auto w-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Profile</h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Manage your personal information and account settings.</p>
        </div>
        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0F172A]"></span>
        </button>
      </div>

      {/* TOP SUMMARY CARD */}
      <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-3xl p-8 border border-transparent dark:border-[#10B981]/20 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 shrink-0 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          <div className="relative shrink-0">
            <div className="w-[140px] h-[140px] rounded-full border-4 border-white dark:border-[#1E293B] shadow-sm bg-[#C6ECCC] dark:bg-[#10B981]/20 overflow-hidden relative">
              <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover scale-110" />
            </div>
            <button className="absolute bottom-1 right-1 w-9 h-9 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-full flex items-center justify-center text-[#144933] dark:text-[#10B981] shadow-sm hover:scale-105 transition-transform z-10">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col items-center sm:items-start justify-center py-2">
            <h2 className="text-[26px] font-bold text-gray-900 dark:text-white font-poppins mb-1 leading-tight">{formData.fullName}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[14px] font-medium text-[#144933] dark:text-[#10B981]">@{formData.username}</span>
              <button onClick={handleCopyUsername} className="text-[#144933] dark:text-[#10B981] hover:opacity-70 transition-opacity">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-[#94A3B8]">
                <Mail className="w-4 h-4 text-[#144933] dark:text-[#10B981]" />
                {formData.email}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-[#94A3B8]">
                <Phone className="w-4 h-4 text-[#144933] dark:text-[#10B981]" />
                {formData.countryCode} {formData.phone}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-[#94A3B8]">
                <Calendar className="w-4 h-4 text-[#144933] dark:text-[#10B981]" />
                Joined March 2025
              </div>
            </div>
          </div>
        </div>
        
        <button className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] text-[#144933] dark:text-[#10B981] font-medium text-[14px] px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-[#334155]/50 transition-colors flex items-center justify-center gap-2 shrink-0 self-start md:self-center w-full md:w-auto">
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* EDIT PROFILE FORM */}
      <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm mb-6 shrink-0 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Edit Profile</h3>
          <button className="bg-[#144933] dark:bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium hover:bg-[#0f3826] dark:hover:bg-[#059669] transition-colors shadow-sm">
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-[#94A3B8] mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 dark:text-[#64748B] text-[14px]">@</span>
              </div>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-[#94A3B8] mb-2">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-[#94A3B8] mb-2">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-700 dark:text-[#94A3B8] mb-2">Phone Number</label>
          <div className="flex">
            <select 
              value={formData.countryCode}
              onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
              className="px-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] border-r-0 rounded-l-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all w-[100px]"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400 dark:text-[#64748B]" />
              </div>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-r-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] font-medium text-gray-700 dark:text-[#94A3B8]">Bio (Optional)</label>
          </div>
          <div className="relative">
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              maxLength={120}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all resize-none"
            ></textarea>
            <div className="absolute bottom-3 right-3 text-[11px] text-gray-400 dark:text-[#64748B] font-medium">
              {formData.bio.length}/120
            </div>
          </div>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 shrink-0 pb-10">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          
          {/* Avatar Collection */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors">
            <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1">Avatar</h3>
            <p className="text-[13px] text-gray-500 dark:text-[#94A3B8] mb-6">Choose your avatar from our collection</p>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 mb-8">
              {avatars.map((url, idx) => {
                const isActive = activeAvatar === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveAvatar(idx)}
                    className={`relative aspect-square rounded-2xl cursor-pointer transition-all ${isActive ? 'ring-2 ring-[#144933] dark:ring-[#10B981] ring-offset-2 dark:ring-offset-[#1E293B] scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#0F172A]">
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover scale-110" />
                    </div>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#144933] dark:bg-[#10B981] rounded-full border-2 border-white dark:border-[#1E293B] flex items-center justify-center text-white z-10">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-center">
              <button className="px-6 py-2.5 border border-gray-200 dark:border-[#334155] text-[#144933] dark:text-[#10B981] font-medium text-[13px] rounded-xl hover:bg-gray-50 dark:hover:bg-[#334155]/50 transition-colors">
                View More Avatars
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors">
            <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-6">Account Actions</h3>
            
            <div className="flex flex-col gap-4">
              <div 
                onClick={logout}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-[#0F172A]/50 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-red-600 dark:text-red-500">Logout</h4>
                    <p className="text-[12px] text-gray-500 dark:text-[#94A3B8]">Sign out from your account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-[#0F172A]/50 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-red-600 dark:text-red-500">Delete Account</h4>
                    <p className="text-[12px] text-gray-500 dark:text-[#94A3B8]">Permanently delete your account and all data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Preferences */}
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-[#334155] rounded-3xl p-8 shadow-sm transition-colors h-fit sticky top-0">
          <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-8">Preferences</h3>
          
          <div className="flex flex-col gap-8">
            
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] border border-gray-100 dark:border-[#334155]">
                   {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Theme</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Choose your preferred theme</p>
                </div>
              </div>
              
              {/* Custom Segmented Control */}
              <div className="flex bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-lg p-1">
                <button 
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${theme !== 'dark' ? 'bg-white dark:bg-[#1E293B] text-[#144933] dark:text-[#10B981] shadow-sm' : 'text-gray-500 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${theme === 'dark' ? 'bg-[#1E293B] text-[#10B981] shadow-sm border border-[#334155]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] border border-gray-100 dark:border-[#334155]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Currency</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Select your currency</p>
                </div>
              </div>
              <select 
                value={preferences.currency}
                onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] text-gray-900 dark:text-white text-[12px] font-medium px-4 py-2 rounded-xl outline-none min-w-[100px]"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
              </select>
            </div>

            {/* Monthly Reminder */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] border border-gray-100 dark:border-[#334155]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Monthly Reminder</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Get reminded about monthly summary</p>
                </div>
              </div>
              
              <button 
                onClick={() => handlePreferenceToggle('monthlyReminder')}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${preferences.monthlyReminder ? 'bg-[#144933] dark:bg-[#10B981]' : 'bg-gray-200 dark:bg-[#334155]'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  style={{ x: preferences.monthlyReminder ? 20 : 0 }}
                />
              </button>
            </div>

            {/* Weekly Insights */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-[#144933] dark:text-[#10B981] border border-gray-100 dark:border-[#334155]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Weekly Insights</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Receive weekly spending insights</p>
                </div>
              </div>
              
              <button 
                onClick={() => handlePreferenceToggle('weeklyInsights')}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${preferences.weeklyInsights ? 'bg-[#144933] dark:bg-[#10B981]' : 'bg-gray-200 dark:bg-[#334155]'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  style={{ x: preferences.weeklyInsights ? 20 : 0 }}
                />
              </button>
            </div>

            {/* Marketing Emails */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center text-gray-500 dark:text-[#94A3B8] border border-gray-100 dark:border-[#334155]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white leading-tight mb-0.5">Marketing Emails</h4>
                  <p className="text-[11px] text-gray-500 dark:text-[#94A3B8]">Receive updates and offers</p>
                </div>
              </div>
              
              <button 
                onClick={() => handlePreferenceToggle('marketingEmails')}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${preferences.marketingEmails ? 'bg-[#144933] dark:bg-[#10B981]' : 'bg-gray-200 dark:bg-[#334155]'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  style={{ x: preferences.marketingEmails ? 20 : 0 }}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;

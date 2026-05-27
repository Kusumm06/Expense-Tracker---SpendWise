import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Wallet, 
  PieChart, 
  Calendar,
  ChevronRight,
  Plus,
  Loader2,
  Laptop,
  Plane,
  Headphones,
  Camera,
  Car,
  Home,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiService } from '../../services/api';
import EditGoalModal from '../../components/common/EditGoalModal';
import toast from 'react-hot-toast';

const getGoalIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('mac') || t.includes('laptop') || t.includes('computer')) return Laptop;
  if (t.includes('trip') || t.includes('travel') || t.includes('europe') || t.includes('flight')) return Plane;
  if (t.includes('headphone') || t.includes('music') || t.includes('studio')) return Headphones;
  if (t.includes('camera') || t.includes('dslr') || t.includes('photo')) return Camera;
  if (t.includes('car') || t.includes('vehicle')) return Car;
  if (t.includes('house') || t.includes('home') || t.includes('apartment')) return Home;
  return Target;
};

const Goals = () => {
  const { toggleGoalModal, refreshTrigger } = useData();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [refreshTrigger]);

  const fetchGoals = async () => {
    try {
      const res = await apiService.getGoals();
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  // Derived Statistics
  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');
  
  const totalGoals = activeGoals.length;
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  
  const avgProgress = totalGoals > 0 
    ? Math.round(goals.reduce((acc, g) => {
        const progress = (g.currentAmount / g.targetAmount) * 100;
        return acc + (progress > 100 ? 100 : progress);
      }, 0) / totalGoals) 
    : 0;

  // Calculate estimated completion (just an average of months left for active goals with deadline)
  let avgMonthsLeft = 0;
  let goalsWithDeadline = 0;
  goals.forEach(g => {
    if (g.deadline) {
      const msLeft = new Date(g.deadline) - new Date();
      if (msLeft > 0) {
        const months = msLeft / (1000 * 60 * 60 * 24 * 30.44);
        avgMonthsLeft += months;
        goalsWithDeadline++;
      }
    }
  });
  
  const estCompletionText = goalsWithDeadline > 0 
    ? `${Math.ceil(avgMonthsLeft / goalsWithDeadline)} months` 
    : (totalGoals > 0 ? 'Not Set' : '0 months');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#144933] dark:text-[#10B981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-6 pb-2">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[#144933] dark:text-white font-poppins transition-colors">Goals</h1>
            <Target className="w-6 h-6 text-[#144933] dark:text-[#10B981]" />
          </div>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-[15px] mt-1 transition-colors">Plan for your dreams. Save today, achieve tomorrow.</p>
        </div>
        
        <button 
          onClick={toggleGoalModal}
          className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white h-11 px-6 rounded-xl font-medium text-[14px] transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-[18px] h-[18px]" />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Total Goals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex gap-4 items-center mb-1">
             <div className="w-12 h-12 bg-green-50 dark:bg-[#10B981]/10 rounded-xl flex items-center justify-center shrink-0">
               <Target className="w-6 h-6 text-green-600 dark:text-[#10B981]" />
             </div>
             <div>
                <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Total Goals</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{totalGoals}</h3>
             </div>
          </div>
          <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] mt-2 ml-[64px] transition-colors">Active goals</p>
        </motion.div>

        {/* Total Saved */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex gap-4 items-center mb-1">
             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0">
               <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
             </div>
             <div>
                <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Total Saved</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">₹{totalSaved.toLocaleString()}</h3>
             </div>
          </div>
          <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] mt-2 ml-[64px] transition-colors">Across all goals</p>
        </motion.div>

        {/* Average Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex gap-4 items-center mb-1">
             <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center shrink-0">
               <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
             </div>
             <div>
                <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Average Progress</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{avgProgress}%</h3>
             </div>
          </div>
          <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] mt-2 ml-[64px] transition-colors">Keep going!</p>
        </motion.div>

        {/* Estimated Completion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-[#334155] shadow-sm transition-colors flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex gap-4 items-center mb-1">
             <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shrink-0">
               <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
             </div>
             <div>
                <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] font-medium mb-1 transition-colors">Estimated Completion</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{estCompletionText}</h3>
             </div>
          </div>
          <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] mt-2 ml-[64px] transition-colors">On average</p>
        </motion.div>

      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Your Active Goals</h2>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-[#334155] overflow-hidden transition-colors">
          {activeGoals.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
               <Target className="w-12 h-12 text-gray-300 dark:text-[#334155] mb-4" />
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active goals</h3>
               <p className="text-[#6B7280] dark:text-[#94A3B8] max-w-sm">Create a new goal to start saving for the things that matter to you.</p>
               <button 
                 onClick={toggleGoalModal}
                 className="mt-6 bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
               >
                 Create New Goal
               </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-[#334155]">
              {activeGoals.map((goal, index) => {
                const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                const isOnTrack = percentage >= 50 || new Date(goal.deadline) > new Date(); // Simplified logic
                const Icon = getGoalIcon(goal.title);
                
                const formattedDate = goal.deadline 
                  ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'No date set';

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={goal._id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#334155]/30 transition-colors group cursor-pointer"
                    onClick={() => handleEditClick(goal)}
                  >
                    
                    {/* Left: Icon & Info */}
                    <div className="flex items-center gap-5 w-1/3 min-w-[250px]">
                      <div className="w-14 h-14 bg-gray-100 dark:bg-[#334155]/50 rounded-full flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Fake image representation using icons for now, since we don't have user uploads for goals */}
                         <Icon className="w-7 h-7 text-gray-500 dark:text-[#94A3B8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[16px] text-gray-900 dark:text-white transition-colors">{goal.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isOnTrack 
                              ? 'bg-green-100 text-green-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            • {isOnTrack ? 'On Track' : 'Behind'}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] truncate transition-colors">For my dream {goal.title.toLowerCase()}</p>
                      </div>
                    </div>

                    {/* Middle: Progress Bar */}
                    <div className="flex-1 px-8 flex items-center gap-4">
                       <span className={`text-[13px] font-bold ${isOnTrack ? 'text-[#144933] dark:text-[#10B981]' : 'text-orange-600 dark:text-orange-500'} w-10 text-right`}>{percentage}%</span>
                       <div className="flex-1 h-2.5 bg-gray-100 dark:bg-[#334155] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isOnTrack ? 'bg-[#144933] dark:bg-[#10B981]' : 'bg-orange-500'}`}
                            style={{ backgroundColor: goal.color || (isOnTrack ? '#144933' : '#F97316') }}
                          />
                       </div>
                    </div>

                    {/* Right: Amounts & Date */}
                    <div className="flex items-center justify-between w-[280px]">
                      <div className="flex flex-col items-end w-full pr-6">
                        <div className="text-[15px] font-medium text-gray-900 dark:text-white mb-1">
                          ₹{goal.currentAmount.toLocaleString()} <span className="text-[#6B7280] dark:text-[#94A3B8]">/ ₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8]">Est. completion: {formattedDate}</p>
                      </div>
                      
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-gray-900 dark:text-[#64748B] dark:group-hover:text-white transition-colors group-hover:bg-gray-100 dark:group-hover:bg-[#334155]">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Goals Section */}
        {completedGoals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              Completed Goals
            </h2>
            <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl border border-[#144933]/10 dark:border-[#10B981]/20 overflow-hidden transition-colors">
              <div className="divide-y divide-[#144933]/5 dark:divide-[#10B981]/10">
                {completedGoals.map((goal, index) => {
                  const Icon = getGoalIcon(goal.title);
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={goal._id}
                      className="p-6 flex items-center justify-between hover:bg-[#144933]/5 dark:hover:bg-[#10B981]/5 transition-colors group cursor-pointer"
                      onClick={() => handleEditClick(goal)}
                    >
                      <div className="flex items-center gap-5 w-1/3 min-w-[250px]">
                        <div className="w-14 h-14 bg-green-100 dark:bg-[#10B981]/20 rounded-full flex items-center justify-center shrink-0 border border-green-200 dark:border-[#10B981]/30">
                           <Icon className="w-7 h-7 text-green-600 dark:text-[#10B981]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-[16px] text-gray-900 dark:text-white transition-colors line-through decoration-green-500/50">{goal.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-200 text-green-800 dark:bg-[#10B981]/30 dark:text-[#10B981] border border-green-300 dark:border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              ✅ Completed
                            </span>
                          </div>
                          <p className="text-[13px] text-green-700/70 dark:text-[#10B981]/70 truncate transition-colors">Target reached: ₹{goal.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {/* Success Glow Box */}
                      <div className="flex-1 flex justify-center">
                         <div className="bg-white/60 dark:bg-[#0F172A]/40 px-6 py-2 rounded-xl flex flex-col items-center border border-green-200/50 dark:border-[#10B981]/20 shadow-sm backdrop-blur-sm">
                            <span className="text-[11px] text-green-600 dark:text-[#10B981]/80 font-semibold mb-0.5 uppercase tracking-wider">Status</span>
                            <span className="text-[14px] font-bold text-gray-800 dark:text-white">Goal Achieved</span>
                         </div>
                      </div>

                      <div className="flex items-center justify-end w-[280px]">
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-green-600 dark:text-[#10B981] hover:bg-green-100 dark:hover:bg-[#10B981]/20 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="bg-[#EEF5ED] dark:bg-[#10B981]/10 rounded-2xl p-5 flex items-center justify-between mt-auto shrink-0 border border-transparent dark:border-[#10B981]/20 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-[#1E293B] rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-[#144933] dark:text-[#10B981]" />
          </div>
          <div>
            <h3 className="font-bold text-[#144933] dark:text-white text-[15px] transition-colors">Small steps today, big achievements tomorrow.</h3>
            <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] transition-colors">Stay consistent and your dreams will become reality.</p>
          </div>
        </div>
        <button 
          onClick={toggleGoalModal}
          className="bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-medium text-[14px] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-[18px] h-[18px]" />
          Create New Goal
        </button>
      </div>

      {/* Edit Modal */}
      <EditGoalModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        goal={selectedGoal}
        onSuccess={fetchGoals}
      />

    </div>
  );
};

export default Goals;

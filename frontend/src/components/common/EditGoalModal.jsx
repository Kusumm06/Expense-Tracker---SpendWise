import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const EditGoalModal = ({ isOpen, onClose, goal, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    color: '#144933'
  });

  useEffect(() => {
    if (goal && isOpen) {
      setFormData({
        title: goal.title || '',
        targetAmount: goal.targetAmount || '',
        currentAmount: goal.currentAmount || 0,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        color: goal.color || '#144933'
      });
    }
  }, [goal, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
      };
      
      const res = await apiService.updateGoal(goal._id, payload);
      if (res.data.success) {
        if (res.data.newlyCompleted) {
          toast.success(`🎉 Congratulations! You completed your ${payload.title} Goal!`, { duration: 5000 });
        } else {
          toast.success('Goal updated successfully');
        }
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    setIsDeleting(true);
    try {
      const res = await apiService.deleteGoal(goal._id);
      if (res.data.success) {
        toast.success('Goal deleted successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete goal');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-[#334155] transition-colors">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors">Edit Goal</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#334155]/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Goal Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. MacBook Fund"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Target Amount (₹)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Saved So Far (₹)</label>
                <input
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all text-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-[2]">
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Target Date</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all text-gray-700"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Color</label>
                <div className="h-[46px] rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] overflow-hidden flex items-center px-1 transition-colors">
                   <input
                     type="color"
                     name="color"
                     value={formData.color}
                     onChange={handleChange}
                     className="w-full h-8 border-none bg-transparent cursor-pointer rounded"
                   />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || loading}
                className="px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center justify-center bg-white dark:bg-[#1E293B]"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
              <button
                type="submit"
                disabled={loading || isDeleting}
                className="flex-1 bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Goal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditGoalModal;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../constants/categories';

const AddBudgetModal = ({ isOpen, onClose, onSuccess, initialMonth, existingBudget }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: CATEGORIES[0].value,
    limitAmount: '',
    month: initialMonth || new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  useEffect(() => {
    if (isOpen) {
      if (existingBudget) {
        setFormData({
          category: existingBudget.category,
          limitAmount: existingBudget.limitAmount,
          month: existingBudget.month
        });
      } else {
        setFormData({
          category: CATEGORIES[0].value,
          limitAmount: '',
          month: initialMonth || new Date().toISOString().slice(0, 7)
        });
      }
    }
  }, [isOpen, existingBudget, initialMonth]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.limitAmount || !formData.category || !formData.month) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        limitAmount: Number(formData.limitAmount),
      };
      
      const res = await apiService.createBudget(payload);
      if (res.data.success) {
        toast.success(existingBudget ? 'Budget updated successfully' : 'Budget set successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors">
              {existingBudget ? 'Update Budget' : 'Set Category Budget'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-[#94A3B8] hover:bg-gray-100 dark:hover:bg-[#334155]/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!!existingBudget} // don't allow changing category if updating
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all disabled:opacity-50"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Monthly Limit (₹)</label>
              <input
                type="number"
                name="limitAmount"
                value={formData.limitAmount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#94A3B8] mb-1.5 transition-colors">Month</label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                disabled={!!existingBudget}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#144933]/20 dark:focus:ring-[#10B981]/20 focus:border-[#144933] dark:focus:border-[#10B981] transition-all disabled:opacity-50"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#144933] dark:bg-[#10B981] hover:bg-[#0f3826] dark:hover:bg-[#059669] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Budget'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddBudgetModal;

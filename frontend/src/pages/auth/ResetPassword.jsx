import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, EyeOff, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, formData.password);
      if (res && res.success) {
        toast.success('Password updated successfully!');
        navigate('/login');
      } else {
        toast.error(res?.message || 'Password reset failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[460px] bg-white rounded-[24px] p-[48px] relative z-10"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-[72px] h-[72px] bg-[#EEF5EA] rounded-full flex items-center justify-center mb-5">
          <ShieldCheck className="w-[32px] h-[32px] text-[#184734]" strokeWidth={1.5} />
        </div>

        <h2 className="font-playfair text-[34px] font-semibold text-[#17392B] leading-none text-center tracking-tight mb-2">
          Create New Password
        </h2>
        <p className="font-inter text-[15px] text-[#6F786F] text-center">
          Enter a strong new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        {/* Create Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
            <Lock className="w-[18px] h-[18px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="New password"
            className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-[48px] text-[15px] text-[#17392B] placeholder:text-[#A0ABA4] border ${formData.password && formData.password.length < 6 ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-[#8DA57B]'} focus:ring-1 outline-none transition-all`}
            value={formData.password}
            onChange={handleChange}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-[18px] flex items-center text-[#A0ABA4] hover:text-[#17392B] transition-colors"
          >
            {showPassword ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
            <Lock className="w-[18px] h-[18px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            required
            placeholder="Confirm new password"
            className={`w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-[48px] text-[15px] text-[#17392B] placeholder:text-[#A0ABA4] border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-[#8DA57B]'} focus:ring-1 outline-none transition-all`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-[18px] flex items-center text-[#A0ABA4] hover:text-[#17392B] transition-colors"
          >
            {showConfirmPassword ? <Eye className="w-[18px] h-[18px]" /> : <EyeOff className="w-[18px] h-[18px]" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] rounded-[12px] font-medium text-[16px] text-white flex items-center justify-center gap-2 transition-all hover:bg-[#123826] bg-[#184734] mt-2 shadow-[0_4px_14px_rgba(24,71,52,0.2)] hover:shadow-[0_6px_20px_rgba(24,71,52,0.3)]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Update password
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;

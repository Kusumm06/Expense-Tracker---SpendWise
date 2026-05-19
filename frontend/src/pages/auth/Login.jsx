import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      if (res && res.success) {
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res?.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
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
        {/* Top Icon */}
        <div className="w-[72px] h-[72px] bg-[#EEF5EA] rounded-full flex items-center justify-center mb-5">
          <User className="w-[32px] h-[32px] text-[#184734]" strokeWidth={1.5} />
        </div>

        <h2 className="font-playfair text-[38px] font-semibold text-[#17392B] leading-none text-center tracking-tight mb-2">
          Welcome back
        </h2>
        <p className="font-inter text-[15px] text-[#6F786F] text-center">
          Log in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        
        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
            <Mail className="w-[18px] h-[18px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-4 text-[15px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[18px] flex items-center pointer-events-none">
            <Lock className="w-[18px] h-[18px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Password"
            className="w-full h-[56px] rounded-[12px] bg-white pl-[48px] pr-[48px] text-[15px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
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

        {/* Remember me & Forgot Password */}
        <div className="flex justify-between items-center mt-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-[16px] h-[16px] rounded-[4px] border-[#E2E8F0] text-[#184734] focus:ring-[#184734]" />
            <span className="text-[13px] font-medium text-[#4B5563]">Remember me</span>
          </label>
          <a href="#" className="text-[13px] font-semibold text-[#184734] hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] rounded-[12px] font-medium text-[16px] text-white flex items-center justify-center gap-2 transition-all hover:bg-[#123826] bg-[#184734]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Log in
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>
      
      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
        <span className="text-[13px] text-[#A0ABA4] font-medium">or continue with</span>
        <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
      </div>

      {/* Social Login */}
      <div className="flex justify-between gap-3">
        {['Google', 'Apple', 'Microsoft'].map((provider) => {
          let iconUrl = '';
          if (provider === 'Google') iconUrl = 'https://www.svgrepo.com/show/475656/google-color.svg';
          if (provider === 'Apple') iconUrl = 'https://www.svgrepo.com/show/511330/apple-173.svg';
          if (provider === 'Microsoft') iconUrl = 'https://www.svgrepo.com/show/475666/microsoft-color.svg';

          return (
            <button 
              key={provider}
              className="flex-1 h-[48px] bg-white border border-[#E2E8F0] rounded-[12px] flex items-center justify-center gap-2 hover:bg-[#F8FAFC] transition-colors"
            >
              <img src={iconUrl} alt={provider} className="w-[18px] h-[18px]" />
              <span className="text-[14px] font-medium text-[#4B5563]">{provider}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[14px] text-[#6F786F]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#184734] font-semibold hover:underline decoration-2 underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;

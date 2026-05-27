import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, EyeOff, Eye, ArrowRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData, rememberMe);
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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error('Please enter your email');
    
    setForgotLoading(true);
    try {
      const res = await forgotPassword(forgotEmail);
      if (res && res.success) {
        toast.success('Reset link sent successfully!');
        setShowForgotModal(false);
        setForgotEmail('');
      } else {
        toast.error(res?.message || 'Failed to send reset link');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
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
        <div className="flex justify-between items-center mt-2 mb-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-[18px] h-[18px] rounded-[6px] border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#184734] border-[#184734] shadow-[0_0_10px_rgba(24,71,52,0.3)]' : 'border-[#E2E8F0] group-hover:border-[#184734]'}`}>
              {rememberMe && (
                <svg className="w-[12px] h-[12px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-[14px] font-medium text-[#4B5563] group-hover:text-[#184734] transition-colors">Remember me</span>
          </label>
          <button 
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-[14px] font-semibold text-[#184734] hover:underline transition-all"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] rounded-[12px] font-medium text-[16px] text-white flex items-center justify-center gap-2 transition-all hover:bg-[#123826] bg-[#184734] shadow-[0_4px_14px_rgba(24,71,52,0.2)] hover:shadow-[0_6px_20px_rgba(24,71,52,0.3)]"
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

      <div className="mt-8 text-center">
        <p className="text-[15px] text-[#6F786F]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#184734] font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
            Create one
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#17392B]/40 backdrop-blur-sm"
              onClick={() => setShowForgotModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[420px] bg-white rounded-[24px] p-8 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
            >
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>

              <div className="w-[56px] h-[56px] bg-[#EEF5EA] rounded-[16px] flex items-center justify-center mb-6">
                <Lock className="w-[28px] h-[28px] text-[#184734]" strokeWidth={1.5} />
              </div>

              <h3 className="font-playfair text-[28px] font-semibold text-[#17392B] leading-tight mb-2">
                Reset Password
              </h3>
              <p className="text-[15px] text-[#6F786F] mb-6">
                Enter your email to receive a password reset link.
              </p>

              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
                    <Mail className="w-[18px] h-[18px] text-[#A0ABA4]" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full h-[52px] rounded-[12px] bg-white pl-[46px] pr-4 text-[15px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-[52px] rounded-[12px] font-medium text-[15px] text-white flex items-center justify-center transition-all hover:bg-[#123826] bg-[#184734] mt-2"
                >
                  {forgotLoading ? (
                    <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Login;

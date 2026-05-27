import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, Mail, Lock, User, ShieldCheck, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
      // API expects name, email, password
      const fullName = formData.lastName ? `${formData.name} ${formData.lastName}`.trim() : formData.name;
      
      const res = await register({
        name: fullName,
        email: formData.email,
        password: formData.password
      });
      
      if (res && res.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res?.message || 'Registration failed');
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
      className="w-full max-w-[500px] bg-white rounded-[24px] p-[48px] relative z-10"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
    >
      <div className="flex flex-col items-center mb-6">
        {/* Top Icon */}
        <div className="w-[72px] h-[72px] bg-[#EEF5EA] rounded-full flex items-center justify-center mb-4">
          <UserPlus className="w-[32px] h-[32px] text-[#184734]" strokeWidth={1.5} />
        </div>

        <h2 className="font-playfair text-[34px] font-semibold text-[#17392B] leading-none text-center tracking-tight mb-2">
          Create your account
        </h2>
        <p className="font-inter text-[14px] text-[#6F786F] text-center">
          Start your journey to financial clarity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
        
        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-[14px]">
          {/* First Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
              <User className="w-[16px] h-[16px] text-[#A0ABA4]" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              name="name"
              required
              placeholder="First name"
              className="w-full h-[52px] rounded-[10px] bg-white pl-[42px] pr-4 text-[14px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Last Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
              <User className="w-[16px] h-[16px] text-[#A0ABA4]" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="w-full h-[52px] rounded-[10px] bg-white pl-[42px] pr-4 text-[14px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
            <Mail className="w-[16px] h-[16px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full h-[52px] rounded-[10px] bg-white pl-[42px] pr-6 text-[14px] text-[#17392B] placeholder:text-[#A0ABA4] border border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-1 focus:ring-[#8DA57B] outline-none transition-all"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Create Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
            <Lock className="w-[16px] h-[16px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Create password"
            className={`w-full h-[52px] rounded-[10px] bg-white pl-[42px] pr-[42px] text-[14px] text-[#17392B] placeholder:text-[#A0ABA4] border ${formData.password && formData.password.length < 6 ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-[#8DA57B]'} focus:ring-1 outline-none transition-all`}
            value={formData.password}
            onChange={handleChange}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-[16px] flex items-center text-[#A0ABA4] hover:text-[#17392B] transition-colors"
          >
            {showPassword ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
            <Lock className="w-[16px] h-[16px] text-[#A0ABA4]" strokeWidth={1.5} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            required
            placeholder="Confirm password"
            className={`w-full h-[52px] rounded-[10px] bg-white pl-[42px] pr-[42px] text-[14px] text-[#17392B] placeholder:text-[#A0ABA4] border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-[#E2E8F0] focus:border-[#8DA57B] focus:ring-[#8DA57B]'} focus:ring-1 outline-none transition-all`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-[16px] flex items-center text-[#A0ABA4] hover:text-[#17392B] transition-colors"
          >
            {showConfirmPassword ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
          </button>
        </div>

        {/* Security Box */}
        <div className="bg-[#EEF2ED] rounded-[12px] p-4 flex gap-[12px] items-start mt-1">
          <ShieldCheck className="w-[20px] h-[20px] text-[#184734] shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <h4 className="font-semibold text-[#17392B] text-[13px] leading-tight mb-1">Your data is safe with us.</h4>
            <p className="text-[12px] text-[#6F786F] leading-snug">We use bank-level encryption to protect your information.</p>
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] rounded-[12px] font-medium text-[16px] text-white mt-4 flex items-center justify-center gap-2 transition-all hover:bg-[#123826] bg-[#184734] shadow-[0_4px_14px_rgba(24,71,52,0.2)] hover:shadow-[0_6px_20px_rgba(24,71,52,0.3)]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Create account
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-[14px] text-[#6F786F]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#184734] font-semibold hover:underline decoration-2 underline-offset-4 transition-all">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await register(formData);
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[560px] bg-[rgba(255,255,255,0.82)] backdrop-blur-[24px] rounded-[36px] p-[60px] mx-4 relative overflow-hidden group/card"
      style={{
        boxShadow: '0 20px 60px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.35)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="w-[120px] h-[120px] bg-[rgba(139,169,127,0.12)] rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 border border-white/40 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
          <div className="w-[90px] h-[90px] bg-[#EAF2E7] rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <User className="w-10 h-10 text-[#183B2D] stroke-[1.5]" />
          </div>
        </div>

        <h2 className="font-playfair text-[52px] font-semibold text-[#183B2D] leading-none text-center tracking-tight">
          Create account
        </h2>
        <p className="font-inter text-[18px] text-[#707B74] mt-3 text-center">
          Join SpendWise for financial clarity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] relative z-10">
        {/* Name Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[24px] flex items-center pointer-events-none z-10">
            <User className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-[#183B2D]' : 'text-[#8BA97F]'}`} />
          </div>
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            className={`w-full h-[74px] rounded-[20px] bg-[rgba(255,255,255,0.75)] pl-[62px] pr-6 text-[18px] text-[#1F3F31] placeholder:text-[#A0ABA4] transition-all duration-300 outline-none
              ${focusedField === 'name' 
                ? 'border-[#8BA97F] shadow-[0_4px_20px_rgba(139,169,127,0.15)] bg-white' 
                : 'border-[rgba(0,0,0,0.05)] hover:border-[#8BA97F]/50 hover:bg-[rgba(255,255,255,0.9)]'} 
              border`}
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {/* Email Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[24px] flex items-center pointer-events-none z-10">
            <Mail className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-[#183B2D]' : 'text-[#8BA97F]'}`} />
          </div>
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className={`w-full h-[74px] rounded-[20px] bg-[rgba(255,255,255,0.75)] pl-[62px] pr-6 text-[18px] text-[#1F3F31] placeholder:text-[#A0ABA4] transition-all duration-300 outline-none
              ${focusedField === 'email' 
                ? 'border-[#8BA97F] shadow-[0_4px_20px_rgba(139,169,127,0.15)] bg-white' 
                : 'border-[rgba(0,0,0,0.05)] hover:border-[#8BA97F]/50 hover:bg-[rgba(255,255,255,0.9)]'} 
              border`}
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-[24px] flex items-center pointer-events-none z-10">
            <Lock className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-[#183B2D]' : 'text-[#8BA97F]'}`} />
          </div>
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className={`w-full h-[74px] rounded-[20px] bg-[rgba(255,255,255,0.75)] pl-[62px] pr-6 text-[18px] text-[#1F3F31] placeholder:text-[#A0ABA4] transition-all duration-300 outline-none
              ${focusedField === 'password' 
                ? 'border-[#8BA97F] shadow-[0_4px_20px_rgba(139,169,127,0.15)] bg-white' 
                : 'border-[rgba(0,0,0,0.05)] hover:border-[#8BA97F]/50 hover:bg-[rgba(255,255,255,0.9)]'} 
              border`}
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[74px] rounded-[22px] font-poppins font-semibold text-[24px] text-white mt-[12px] relative overflow-hidden group/btn disabled:opacity-70 flex items-center justify-center transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_15px_30px_rgba(24,71,52,0.2)]"
          style={{ background: 'linear-gradient(135deg, #184734 0%, #215C45 100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          
          <span className="relative z-10 flex items-center">
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/80 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Create account'
            )}
          </span>
        </button>
      </form>
      
      <div className="mt-[44px] text-center relative z-10">
        <p className="text-[18px] text-[#68756D]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#215C45] font-semibold hover:underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;

import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { PieChart, ShieldCheck, Target } from 'lucide-react';

const AuthLayout = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#FAFCF9] overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic ease
        className="w-[92%] h-[92vh] bg-bg-light rounded-[36px] shadow-soft flex overflow-hidden relative"
      >
        {/* LEFT SECTION (52%) */}
        <div 
          className="hidden lg:flex flex-col w-[52%] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F5F8F2 0%, #EAF1E7 40%, #E4ECE1 100%)' }}
        >
          {/* Ambient Glowing Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8BA97F] rounded-full blur-[120px] mix-blend-multiply opacity-40 pointer-events-none"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FFFBF0] rounded-full blur-[140px] opacity-60 pointer-events-none"
          />
          {/* Warm Sunlight Glow */}
          <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#FDF5E6] rounded-full blur-[100px] opacity-70 pointer-events-none z-10 mix-blend-overlay"></div>
          
          <div className="relative z-20 p-[70px] flex flex-col h-full">
            {/* Logo */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-3 mb-[10vh]"
            >
              <div className="w-[42px] h-[42px] bg-[#1F5A45] rounded-full flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-poppins font-bold text-[32px] text-[#183B2D] leading-none">SpendWise</h1>
                <p className="text-[14px] text-[#617065] mt-1 font-medium tracking-wide">Smart tracking. Better living.</p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="max-w-[650px] mb-10"
            >
              <h2 
                className="font-playfair text-[72px] font-semibold text-[#183B2D] tracking-[-2px]"
                style={{ lineHeight: 1.08 }}
              >
                Welcome back.<br />
                Continue your journey<br />
                towards <span className="text-[#8BA97F] italic" style={{ textShadow: '0 0 20px rgba(139,169,127,0.4)' }}>clarity.</span>
              </h2>
              <p className="font-inter text-[19px] font-normal text-[#617065] w-[480px] mt-6 leading-[1.7]">
                Log in to manage expenses, track savings, and stay financially mindful.
              </p>
            </motion.div>

            {/* Quote Card */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.3 }}
              className="absolute bottom-[70px] left-[70px] w-[360px] h-[110px] bg-[rgba(18,63,45,0.88)] backdrop-blur-[18px] border border-[rgba(255,255,255,0.08)] rounded-[28px] p-6 flex items-center shadow-2xl z-30 overflow-hidden group"
            >
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.05)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
              <p className="text-white text-[22px] font-medium leading-[1.4] font-playfair italic">
                "Small steps today lead to financial freedom tomorrow."
              </p>
            </motion.div>
          </div>

          {/* Cinematic Illustration Background */}
          <div className="absolute bottom-[-5%] right-[-10%] w-[900px] h-[900px] opacity-50 pointer-events-none mix-blend-multiply z-0">
            <img 
              src="/illustration.png" 
              alt="Nature growth illustration" 
              className="w-full h-full object-cover rounded-full filter blur-[4px]" 
              style={{ maskImage: 'radial-gradient(black, transparent 60%)', WebkitMaskImage: 'radial-gradient(black, transparent 60%)' }} 
            />
          </div>
          
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-[20%] w-[620px] z-10 pointer-events-none"
          >
            <img 
              src="/illustration.png" 
              alt="Traveler" 
              className="w-full h-auto object-contain" 
              style={{ 
                maskImage: 'linear-gradient(to top, black 50%, transparent 100%), radial-gradient(circle at center, black 60%, transparent 90%)', 
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
                filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.15))'
              }} 
            />
            
            {/* Animated Particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -100],
                  x: [0, (i % 2 === 0 ? 30 : -30)],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 rounded-full bg-white/40 blur-[1px]"
                style={{
                  top: `${40 + (i * 10)}%`,
                  left: `${30 + (i * 15)}%`
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* RIGHT SECTION (48%) */}
        <div className="w-full lg:w-[48%] h-full flex flex-col justify-center items-center relative z-20 bg-transparent">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

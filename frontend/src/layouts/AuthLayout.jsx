import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { motion } from 'framer-motion';
import { PieChart, LineChart, Calendar, Leaf } from 'lucide-react';

const AuthLayout = () => {
  const { token, loading } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] font-sans">
      <div className="w-full max-w-[1440px] h-[90vh] min-h-[800px] flex rounded-[32px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative">
        
        {/* LEFT SECTION (55%) */}
        <div className="hidden lg:flex flex-col w-[55%] h-full relative overflow-hidden shrink-0">
          
          {/* Cinematic Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/auth_hero.jpg" 
              alt="Premium Onboarding" 
              className="w-full h-full object-cover object-right"
              style={{
                filter: 'brightness(98%) saturate(105%) contrast(100%)'
              }}
            />
          </div>

          {/* White Gradient Overlay for Readability (Fades Left to Right) */}
          <div 
            className="absolute inset-0 z-10"
            style={{ 
              background: 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)' 
            }}
          ></div>

          {/* Left Panel Content */}
          <div className="relative z-20 p-[64px] flex flex-col h-full w-full">
            
            {/* Top Logo Area */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-[12px]"
            >
              <div className="w-[36px] h-[36px] bg-[#184734] rounded-full flex items-center justify-center">
                <PieChart className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="font-poppins font-bold text-[20px] text-[#17392B] leading-none tracking-tight">SpendWise</h1>
                <p className="text-[11px] text-[#6F786F] mt-1 font-medium tracking-wide">Smart tracking. Better living.</p>
              </div>
            </motion.div>

            {/* Spacer */}
            <div className="h-[60px]"></div>

            {/* Hero Heading & Subtext */}
            <div className="w-full max-w-[480px]">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {isLogin ? (
                  <>
                    <h2 
                      className="font-playfair text-[56px] font-semibold text-[#17392B] tracking-tight mb-4"
                      style={{ lineHeight: 1.1 }}
                    >
                      Welcome back<br />
                      to <span className="text-[#6B8E6B] italic">smarter</span><br />
                      <span className="text-[#6B8E6B] italic relative inline-block">
                        finances
                        <Leaf className="inline w-[32px] h-[32px] ml-2 text-[#6B8E6B] -translate-y-1" strokeWidth={2} />
                        <span className="absolute bottom-2 left-0 w-full h-[2px] bg-[#6B8E6B]/40 rounded-full"></span>
                      </span>
                    </h2>
                    <p className="font-inter text-[16px] font-medium text-[#4B5563] w-[400px] leading-[1.6]">
                      Log in to manage your expenses, track your savings and achieve financial clarity.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 
                      className="font-playfair text-[56px] font-semibold text-[#17392B] tracking-tight mb-4"
                      style={{ lineHeight: 1.1 }}
                    >
                      Start your journey<br />
                      towards <span className="text-[#6B8E6B] italic relative inline-block">
                        financial clarity.
                        <span className="absolute bottom-2 left-0 w-full h-[2px] bg-[#6B8E6B]/40 rounded-full"></span>
                      </span>
                    </h2>
                    <p className="font-inter text-[16px] font-medium text-[#4B5563] w-[400px] leading-[1.6]">
                      Create your account and build smarter financial habits today.
                    </p>
                  </>
                )}
              </motion.div>

              {/* Spacer */}
              <div className="h-[40px]"></div>

              {/* Feature Rows - Only show on Register */}
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-col gap-[24px]"
                >
                  {[
                    { title: 'Smart expense tracking', subtext: 'Track every expense with ease.', icon: PieChart },
                    { title: 'Monthly budget planning', subtext: 'Plan budgets and stay on track.', icon: Calendar },
                    { title: 'Financial growth insights', subtext: 'Visualize growth and spend smarter.', icon: LineChart }
                  ].map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + (idx * 0.1), duration: 0.4 }}
                      className="flex items-start gap-[16px]"
                    >
                      <div className="w-[48px] h-[48px] rounded-[14px] bg-[#EEF5EA] flex items-center justify-center shrink-0">
                        <feature.icon className="w-[20px] h-[20px] text-[#184734]" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col justify-center mt-1">
                        <h3 className="text-[15px] font-semibold text-[#17392B] leading-tight mb-1">{feature.title}</h3>
                        <p className="text-[13px] text-[#6F786F]">{feature.subtext}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (45%) */}
        <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center relative z-20 shrink-0 bg-[#FBFDFB]">
          {/* Subtle gradient to blend the edge if needed, though split is sharp in image */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

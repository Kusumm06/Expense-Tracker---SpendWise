import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Menu, 
  Bell 
} from 'lucide-react';
import clsx from 'clsx';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Add Expense', path: '/add-expense', icon: PlusCircle },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background-main flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-primary-dark/40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-primary-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center px-6 h-20 border-b border-white/10">
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 bg-primary-accent rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold tracking-wide">ExpenseHQ</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => clsx(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary-accent text-white shadow-md shadow-primary-accent/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={clsx(
                  "mr-3 h-5 w-5 transition-colors",
                  // Remove group-hover logic since active state text is white anyway
                )} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl transition-colors hover:bg-danger/10 hover:text-danger group"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:text-danger transition-colors" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-card-bg shadow-sm border-b border-border-color z-10">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <button
              className="p-2 -ml-2 mr-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-between items-center lg:justify-end gap-4">
              <div className="hidden sm:block"></div>

              <div className="flex items-center gap-5 pl-4 sm:pl-6 ml-4 sm:ml-6 lg:border-l lg:border-border-color">
                <button className="text-text-secondary hover:text-primary-accent transition-colors relative p-2 hover:bg-slate-50 rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-accent/10 flex items-center justify-center text-primary-accent font-bold text-lg border border-primary-accent/20 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                    <p className="text-xs text-text-secondary truncate max-w-[150px]">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background-main">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

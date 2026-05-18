import { useAuth } from '../../hooks/useAuth';
import { Mail, Calendar, Edit3, Camera } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account settings and preferences</p>
      </div>

      <Card noPadding className="overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-dark via-slate-800 to-primary-dark relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8 relative">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6 inline-block group">
            <div className="h-32 w-32 rounded-3xl border-4 border-card-bg bg-background-main flex items-center justify-center text-5xl font-bold text-primary-accent shadow-lg overflow-hidden relative z-10 transition-transform group-hover:scale-105">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {/* Future enhancement: Upload avatar button */}
            <button className="absolute bottom-2 right-2 bg-primary-dark text-white p-2 rounded-xl shadow-md hover:bg-slate-800 transition-colors z-20">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{user?.name}</h2>
              <div className="flex flex-col gap-2 mt-3">
                <p className="text-text-secondary flex items-center text-sm font-medium">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  {user?.email}
                </p>
                <p className="text-text-secondary flex items-center text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <Button variant="secondary" icon={Edit3}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-6">Account Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div className="p-4 bg-slate-50/50 rounded-xl border border-border-color">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Full Name</p>
            <p className="font-medium text-text-primary">{user?.name}</p>
          </div>
          <div className="p-4 bg-slate-50/50 rounded-xl border border-border-color">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Email Address</p>
            <p className="font-medium text-text-primary">{user?.email}</p>
          </div>
          <div className="p-4 bg-slate-50/50 rounded-xl border border-border-color sm:col-span-2">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Account ID</p>
            <p className="font-medium text-text-primary font-mono text-sm">{user?._id}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

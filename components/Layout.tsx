import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  BookOpen, 
  User as UserIcon, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  GraduationCap,
  Briefcase,
  Menu,
  X
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-indigo-100 text-indigo-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <GraduationCap size={28} />
            <span>EduMatch</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="ml-auto lg:hidden text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {user?.role === UserRole.STUDENT && (
            <>
              <NavItem to="/student/opportunities" icon={BookOpen} label="Opportunities" />
              <NavItem to="/student/profile" icon={UserIcon} label="My Profile" />
            </>
          )}

          {user?.role === UserRole.PROFESSOR && (
            <>
              <NavItem to="/professor/opportunities" icon={Briefcase} label="My Opportunities" />
              <NavItem to="/professor/applications" icon={UserIcon} label="Applications" />
            </>
          )}

          {user?.role === UserRole.ADMIN && (
            <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}

          <NavItem to="/chat" icon={MessageSquare} label="Messages" />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 lg:hidden">
           <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <GraduationCap size={24} />
            <span>EduMatch</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
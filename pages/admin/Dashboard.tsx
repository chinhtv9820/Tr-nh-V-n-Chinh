import React, { useEffect, useState } from 'react';
import { MockAdminService } from '../../services/mockService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    MockAdminService.getStats().then(setStats);
  }, []);

  const mockChartData = [
    { name: 'Mon', applications: 4 },
    { name: 'Tue', applications: 3 },
    { name: 'Wed', applications: 2 },
    { name: 'Thu', applications: 7 },
    { name: 'Fri', applications: 5 },
    { name: 'Sat', applications: 1 },
    { name: 'Sun', applications: 2 },
  ];

  const pieData = [
    { name: 'CS', value: 400 },
    { name: 'Biology', value: 300 },
    { name: 'Math', value: 300 },
    { name: 'Physics', value: 200 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || '...'} 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Active Opportunities" 
          value={stats?.totalOpportunities || '...'} 
          icon={BookOpen} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || '...'} 
          icon={FileText} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600"/>
            Application Activity (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false}/>
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-lg text-slate-800 mb-6">Opportunities by Category</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-4 text-sm text-slate-600 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  {entry.name}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
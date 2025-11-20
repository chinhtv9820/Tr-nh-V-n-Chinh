import React, { useEffect, useState } from 'react';
import { MockOpportunityService, MockApplicationService } from '../../services/mockService';
import { Opportunity, Application } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, Calendar, User, ArrowRight, CheckCircle } from 'lucide-react';

const OpportunityList: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await MockOpportunityService.getAll();
      setOpportunities(data);
      // In a real app, we'd fetch the user's applications to disable the "Apply" button
      // For demo, we'll just local state it
    };
    loadData();
  }, []);

  const handleApply = async (opp: Opportunity) => {
    if (!user) return;
    setApplying(opp.id);
    try {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        studentId: user.id,
        studentName: user.name,
        status: 'pending'
      };
      await MockApplicationService.apply(newApp);
      setAppliedIds(prev => [...prev, opp.id]);
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const filteredOpps = opportunities.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Opportunities</h1>
          <p className="text-slate-500">Find the perfect research role for your academic career.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map(opp => (
          <div key={opp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {opp.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                   <Calendar size={14} />
                   {opp.deadline}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{opp.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">{opp.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <User size={12} />
                </div>
                {opp.professorName}
              </div>
            </div>
            
            <div className="p-6 pt-0 mt-auto">
              {appliedIds.includes(opp.id) ? (
                 <button disabled className="w-full bg-green-50 text-green-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-default">
                   <CheckCircle size={18} />
                   Applied
                 </button>
              ) : (
                <button
                  onClick={() => handleApply(opp)}
                  disabled={applying === opp.id}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  {applying === opp.id ? 'Applying...' : (
                    <>Apply Now <ArrowRight size={18} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityList;
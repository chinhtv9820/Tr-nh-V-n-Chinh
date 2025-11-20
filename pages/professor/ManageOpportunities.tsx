import React, { useEffect, useState } from 'react';
import { MockOpportunityService } from '../../services/mockService';
import { Opportunity } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Calendar, Briefcase } from 'lucide-react';

const ManageOpportunities: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: '',
    description: '',
    deadline: '',
    category: ''
  });

  useEffect(() => {
    if (user) {
      MockOpportunityService.getByProfessor(user.id).then(setOpportunities);
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const opp: Opportunity = {
      id: `opp-${Date.now()}`,
      ...newOpp,
      professorId: user.id,
      professorName: user.name
    };
    await MockOpportunityService.create(opp);
    setOpportunities([...opportunities, opp]);
    setShowForm(false);
    setNewOpp({ title: '', description: '', deadline: '', category: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      await MockOpportunityService.delete(id);
      setOpportunities(opportunities.filter(o => o.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Opportunities</h1>
          <p className="text-slate-500">Create and manage your research listings.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Post New Opportunity
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4">Create New Opportunity</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Title"
                required
                value={newOpp.title}
                onChange={e => setNewOpp({...newOpp, title: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                placeholder="Category (e.g. AI, Biology)"
                required
                value={newOpp.category}
                onChange={e => setNewOpp({...newOpp, category: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <textarea
              placeholder="Description"
              required
              value={newOpp.description}
              onChange={e => setNewOpp({...newOpp, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
            />
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-600">Deadline:</label>
              <input
                type="date"
                required
                value={newOpp.deadline}
                onChange={e => setNewOpp({...newOpp, deadline: e.target.value})}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Post Opportunity</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Briefcase className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-500">You haven't posted any opportunities yet.</p>
          </div>
        ) : (
          opportunities.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{opp.title}</h3>
                <p className="text-slate-500 text-sm mb-2">{opp.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{opp.category}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> Deadline: {opp.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button onClick={() => handleDelete(opp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto md:ml-0">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOpportunities;
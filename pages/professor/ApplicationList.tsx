import React, { useEffect, useState } from 'react';
import { MockApplicationService } from '../../services/mockService';
import { Application } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Loader2, Check, X } from 'lucide-react';

const ApplicationList: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [matchingId, setMatchingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      MockApplicationService.getByProfessor(user.id).then(setApplications);
    }
  }, [user]);

  const handleMatch = async (appId: string) => {
    setMatchingId(appId);
    try {
      const updatedApp = await MockApplicationService.triggerMatch(appId);
      setApplications(apps => apps.map(a => a.id === appId ? updatedApp : a));
    } catch (e) {
      alert('Match service unavailable');
    } finally {
      setMatchingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Applications Received</h1>
        <p className="text-slate-500">Review student applications and use AI Matching.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">AI Match Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No applications yet.</td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{app.studentName}</div>
                    <div className="text-xs text-slate-400">ID: {app.studentId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {app.aiMatchScore ? (
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(app.aiMatchScore)}`}>
                        <Sparkles size={14} />
                        {app.aiMatchScore}% Match
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleMatch(app.id)}
                        disabled={matchingId === app.id}
                        className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-2 disabled:opacity-50"
                      >
                        {matchingId === app.id ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                        Calculate Match
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Accept"><Check size={18} /></button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Reject"><X size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
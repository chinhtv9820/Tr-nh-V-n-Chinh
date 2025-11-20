import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile } from '../../types';
import { MockProfileService } from '../../services/mockService';
import { User, Save, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    userId: user?.id || '',
    fullName: user?.name || '',
    major: '',
    gpa: 0,
    skills: [],
    preferences: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const data = await MockProfileService.get(user.id);
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await MockProfileService.update(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your academic information for better matching.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-indigo-600 w-full relative">
           <div className="absolute -bottom-12 left-8">
             <div className="w-24 h-24 rounded-full bg-white p-1">
               <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={40} />
               </div>
             </div>
           </div>
        </div>

        <form onSubmit={handleSave} className="p-8 pt-16 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({...profile, fullName: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Major</label>
              <input
                type="text"
                value={profile.major}
                onChange={e => setProfile({...profile, major: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GPA (0.0 - 4.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={profile.gpa}
                onChange={e => setProfile({...profile, gpa: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {profile.skills.map(skill => (
                <span key={skill} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-indigo-900">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Add a skill (e.g. Python)"
              />
              <button type="button" onClick={addSkill} className="bg-slate-100 px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-200">Add</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Research Preferences</label>
            <textarea
              value={profile.preferences}
              onChange={e => setProfile({...profile, preferences: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              placeholder="Describe your research interests..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
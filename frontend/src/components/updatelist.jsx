import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { Edit3, Search, Loader2, Code2 } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

function UpdateList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-300 font-sans selection:bg-indigo-500/30">

      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-6 bg-[#0B1329]/90 backdrop-blur-md sticky top-0 z-50">
        <NavLink to="/admin" className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white hover:opacity-90 transition-opacity no-underline group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
            <Code2 className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          </div>
          <span>Code<span className="text-indigo-400">Craze</span></span>
        </NavLink>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2.5 py-1 rounded-md">
            Admin Portal
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Section Title & Description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Select Problem to Update</h2>
            <p className="text-xs text-slate-400 mt-1">Choose a problem from the repository to edit specifications or code templates.</p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-[#121722]/80 border border-slate-800/80 px-3 py-1.5 rounded-lg self-start md:self-auto">
            Total Problems: <span className="text-indigo-400 font-bold">{filteredProblems.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-indigo-400" size={18} />
          <input
            type="text"
            placeholder="Search problems by title, tag, or difficulty..."
            className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-[#121722] outline-none transition-all shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Problems List */}
        <div className="grid gap-3.5">
          {filteredProblems.map((prob) => {
            // Difficulty Badge Dynamic Colors
            const difficultyColor =
              prob.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                prob.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/20';

            return (
              <div
                key={prob._id}
                onClick={() => navigate(`/admin/update/${prob._id}`)}
                className="bg-[#121722]/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#121722] p-4 sm:p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-indigo-500/5"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {prob.title}
                  </h3>

                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${difficultyColor}`}>
                      {prob.difficulty}
                    </span>
                    {prob.tags && prob.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {prob.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-md border border-slate-800/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50 text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                  <Edit3 size={18} />
                </div>
              </div>
            );
          })}

          {filteredProblems.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#121722]/30">
              <p className="text-sm text-slate-500">No matching problems found.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default UpdateList;
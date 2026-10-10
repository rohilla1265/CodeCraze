import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink } from 'react-router';
import axiosClient from '../../utils/axiosClient';
import { Loader2, Trash2, Save, X, Terminal, Code2, Box, ChevronRight, Award } from 'lucide-react';

const TAG_OPTIONS = [
  "array", "linkedList", "graph", "dp", "string", "twoPointers",
  "tree", "matrix", "sorting", "binarySearch", "recursion",
  "backtracking", "greedy", "stack", "queue", "heap", "hashing",
  "bitManipulation", "slidingWindow", "prefixSum", "trie",
  "segmentTree", "disjointSet", "graphTraversal", "shortestPath",
  "minimumSpanningTree", "topologicalSort", "memoization",
  "tabulation", "intervals", "math", "geometry", "gameTheory",
  "randomized"
];

const ProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.coerce.number().min(5, 'Points must be at least 5'),
  tags: z.array(z.enum(TAG_OPTIONS)).min(1, 'At least one tag is required'),
  visibleTestcases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
    explaination: z.string().optional()
  })),
  hiddenTestcases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1)
  })),
  startCode: z.array(z.object({ language: z.string(), initialCode: z.string() })),
  referenceSolution: z.array(z.object({ language: z.string(), completeCode: z.string() }))
});

function UpdatePanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      tags: [],
      points: 5
    }
  });

  const selectedTags = watch('tags') || [];

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestcases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestcases' });

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/${id}`);

        // Ensure tags is array
        if (data.tags && !Array.isArray(data.tags)) {
          data.tags = [data.tags];
        }

        reset(data);
        setOriginalTitle(data.title);
      } catch (error) {
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, reset, navigate]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setValue('tags', selectedTags.filter(t => t !== tag), { shouldValidate: true });
    } else {
      setValue('tags', [...selectedTags, tag], { shouldValidate: true });
    }
  };

  const onUpdate = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert('Updated Successfully!');
      navigate('/admin/update');
    } catch (err) { alert('Update failed'); }
  };

  const onDelete = async () => {
    if (confirmTitle.trim().toLowerCase() !== originalTitle?.trim().toLowerCase()) {
      alert("Title match nahi kar raha!");
      return;
    }

    try {
      await axiosClient.delete(`/problem/${id}`);
      navigate('/admin/delete');
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4 font-sans">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-slate-500 text-sm tracking-widest uppercase">Fetching Assets...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#080B11] text-slate-300 font-sans overflow-hidden flex flex-col selection:bg-indigo-500/30">

      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-6 bg-[#0B1329]/90 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-6">
          <NavLink to="/admin/update" className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white hover:opacity-90 transition-opacity no-underline group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
            <span>Code<span className="text-indigo-400">Craze</span></span>
          </NavLink>

          <div className="h-4 w-px bg-slate-800"></div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">Problems</span>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-slate-200 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
              {watch('title') || 'Untitled Editor'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
            title="Delete Challenge"
          >
            <Trash2 size={17} />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSubmit(onUpdate)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </header>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onUpdate)} className="flex-1 flex overflow-hidden">

        {/* Left Pane */}
        <div className="w-1/2 overflow-y-auto p-8 space-y-10 border-r border-slate-800/80 custom-scrollbar pb-32">

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Box size={14} /> 01. Problem Identity
              </h2>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Metadata</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problem Title</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Merge Two Sorted Lists"
                  className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-[#121722] outline-none text-base font-semibold text-white transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</label>
                  <select {...register('difficulty')} className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-200 transition-all">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Points (Min 5)</span>
                    <Award size={12} className="text-amber-400" />
                  </label>
                  <input
                    type="number"
                    min={5}
                    {...register('points')}
                    className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-200 transition-all"
                  />
                  {errors.points && <p className="text-rose-400 text-[10px]">{errors.points.message}</p>}
                </div>
              </div>

              {/* Multi-Select Tags Pool */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Category Tags (Select Multiple)
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-[#121722]/60 border border-slate-800 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                  {TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all ${isSelected
                            ? 'bg-indigo-600 text-white border border-indigo-400'
                            : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                      >
                        {isSelected && '✓ '}{tag}
                      </button>
                    );
                  })}
                </div>
                {errors.tags && <p className="text-rose-400 text-[10px]">{errors.tags.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  {...register('description')}
                  placeholder="Describe problem specifications, constraints, and edge cases..."
                  className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl p-4 h-48 focus:border-indigo-500 outline-none font-mono text-xs leading-relaxed text-slate-200 placeholder:text-slate-600 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Testcases Section */}
          {/* <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal size={14}/> 02. Test Environments
              </h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explaination: '' })} className="px-3 py-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all">+ Public Case</button>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="px-3 py-1.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg hover:bg-sky-500/20 transition-all">+ Hidden Case</button>
              </div>
            </div>
            
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#121722]/60 border border-slate-800 rounded-xl relative group border-l-4 border-l-emerald-500 transition-all hover:border-slate-700">
                  <button type="button" onClick={() => removeVisible(index)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"><X size={14}/></button>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input {...register(`visibleTestcases.${index}.input`)} placeholder="Input" className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all" />
                    <input {...register(`visibleTestcases.${index}.output`)} placeholder="Output" className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  <input {...register(`visibleTestcases.${index}.explaination`)} placeholder="Explanation (Optional)" className="w-full bg-transparent px-1 text-[11px] text-slate-400 italic outline-none" />
                </div>
              ))}

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#121722]/60 border border-slate-800 rounded-xl relative group border-l-4 border-l-sky-500 transition-all hover:border-slate-700">
                   <button type="button" onClick={() => removeHidden(index)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"><X size={14}/></button>
                   <div className="grid grid-cols-2 gap-3">
                    <input {...register(`hiddenTestcases.${index}.input`)} placeholder="Secret Input" className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all" />
                    <input {...register(`hiddenTestcases.${index}.output`)} placeholder="Secret Output" className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section> */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal size={14} /> 02. Test Environments
              </h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explaination: '' })} className="px-3 py-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all">+ Public Case</button>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="px-3 py-1.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg hover:bg-sky-500/20 transition-all">+ Hidden Case</button>
              </div>
            </div>

            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#121722]/60 border border-slate-800 rounded-xl relative group border-l-4 border-l-emerald-500 transition-all hover:border-slate-700">
                  <button type="button" onClick={() => removeVisible(index)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"><X size={14} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 font-mono">
                    <textarea {...register(`visibleTestcases.${index}.input`)} placeholder="Input" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all h-24 resize-y" />
                    <textarea {...register(`visibleTestcases.${index}.output`)} placeholder="Output" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all h-24 resize-y" />
                  </div>
                  <input {...register(`visibleTestcases.${index}.explaination`)} placeholder="Explanation (Optional)" className="w-full bg-transparent px-1 text-[11px] text-slate-400 italic outline-none" />
                </div>
              ))}

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-[#121722]/60 border border-slate-800 rounded-xl relative group border-l-4 border-l-sky-500 transition-all hover:border-slate-700">
                  <button type="button" onClick={() => removeHidden(index)} className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"><X size={14} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                    <textarea {...register(`hiddenTestcases.${index}.input`)} placeholder="Secret Input" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all h-24 resize-y" />
                    <textarea {...register(`hiddenTestcases.${index}.output`)} placeholder="Secret Output" className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-all h-24 resize-y" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Pane */}
        <div className="w-1/2 bg-[#080B11]/90 border-l border-slate-800/80 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-32">
          <div className="sticky top-0 bg-[#080B11] py-2 z-10 border-b border-slate-800/50 mb-6">
            <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Code2 size={14} /> 03. Boilerplate & Reference Code
            </h2>
          </div>

          {['c++', 'java', 'js'].map((lang, index) => (
            <div key={lang} className="space-y-4 bg-[#121722]/40 p-5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                  {lang} Environment
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initial Template</label>
                  <textarea
                    {...register(`startCode.${index}.initialCode`)}
                    className="w-full bg-[#080B11] border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-indigo-300 h-36 outline-none focus:border-indigo-500 transition-all resize-none"
                    placeholder={`// Insert ${lang} starter template...`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reference Solution</label>
                  <textarea
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="w-full bg-[#080B11] border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-emerald-400 h-36 outline-none focus:border-emerald-500 transition-all resize-none"
                    placeholder={`// Insert complete ${lang} solution...`}
                  />
                </div>

                <input type="hidden" {...register(`startCode.${index}.language`)} value={lang} />
                <input type="hidden" {...register(`referenceSolution.${index}.language`)} value={lang} />
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-[#0B1329] border border-slate-800 w-full max-w-sm rounded-2xl p-7 shadow-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Delete Permanently?</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Confirm action by typing the exact problem title:
              </p>
              <div className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-rose-400 font-mono text-xs font-semibold select-all break-all">
                {originalTitle}
              </div>
            </div>

            <input
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              placeholder="Type problem title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 text-rose-400 text-xs transition-all"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModal(false);
                  setConfirmTitle("");
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={confirmTitle.trim().toLowerCase() !== originalTitle?.trim().toLowerCase()}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-20 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:cursor-not-allowed shadow-lg shadow-rose-600/20"
              >
                Destroy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePanel;
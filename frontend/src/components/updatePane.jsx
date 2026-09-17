import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink } from 'react-router';
import axiosClient from '../../utils/axiosClient';
import { Loader2, Trash2, Save, X, Plus, Terminal, Code2, Settings2, Box, ChevronRight } from 'lucide-react';

const ProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers']),
  visibleTestcases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
    explaination: z.string().min(1)
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

  const { register, control, handleSubmit, reset, watch, formState: { isDirty } } = useForm({
    resolver: zodResolver(ProblemSchema)
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestcases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestcases' });

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/${id}`);
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

  const onUpdate = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert('Updated Successfully!');
      navigate('/admin/update');
    } catch (err) { alert('Update failed'); }
  };

  // const onDelete = async () => {
  //   if (confirmTitle !== originalTitle) return;
  //   try {
  //     await axiosClient.delete(`/problem/${id}`);
  //     navigate('/admin/delete');
  //   } catch (err) { alert('Delete failed'); }
  // };
  const onDelete = async () => {
  // Trim aur Lowercase se spaces/casing mismatch solve hoga
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

//   return (
//     <div className="h-screen bg-[#050505] text-slate-300 font-sans overflow-hidden flex flex-col">
      
//       {/* Top Navigation Bar */}
//       <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]">
//         <div className="flex items-center gap-4">
//           <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-500"><Settings2 size={20}/></div>
//           <div className="flex items-center gap-2 text-sm font-medium">
//             <span className="text-slate-500">Problems</span>
//             <ChevronRight size={14} className="text-slate-700"/>
//             <span className="text-white">{watch('title') || 'Editor'}</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//             <button onClick={() => setDeleteModal(true)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
//             <div className="h-4 w-px bg-white/10 mx-2"></div>
//             <button onClick={() => navigate(-1)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider">Discard</button>
//             <button onClick={handleSubmit(onUpdate)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
//                 <Save size={14}/> Save Changes
//             </button>
//         </div>
//       </nav>

//       <form onSubmit={handleSubmit(onUpdate)} className="flex-1 flex overflow-hidden">
        
//         {/* Left Side: Configuration (Scrollable) */}
//         <div className="w-1/2 overflow-y-auto p-8 space-y-12 border-right border-white/5 custom-scrollbar pb-32">
          
//           {/* Metadata Section */}
//           <section className="space-y-6">
//             <h2 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
//               <Box size={14}/> 01. Problem Identity
//             </h2>
//             <div className="space-y-4">
//               <input {...register('title')} placeholder="Enter Problem Title..." className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 focus:border-indigo-500 outline-none text-xl font-semibold text-white transition-all shadow-inner" />
//               <div className="grid grid-cols-2 gap-4">
//                 <select {...register('difficulty')} className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-xs font-bold uppercase tracking-widest">
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//                 <select {...register('tags')} className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-xs font-bold uppercase tracking-widest">
//                    {['array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers'].map(t => <option key={t} value={t}>{t}</option>)}
//                 </select>
//               </div>
//               <textarea {...register('description')} placeholder="Describe the challenge..." className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 h-48 focus:border-indigo-500 outline-none font-mono text-sm leading-relaxed" />
//             </div>
//           </section>

//           {/* Testcases Section */}
//           <section className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h2 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
//                   <Terminal size={14}/> 02. Test Environments
//                 </h2>
//                 <div className="flex gap-2">
//                     <button type="button" onClick={() => appendVisible({ input: '', output: '', explaination: '' })} className="px-3 py-1.5 text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md uppercase">+ Public</button>
//                     <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="px-3 py-1.5 text-[9px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md uppercase">+ Hidden</button>
//                 </div>
//             </div>
            
//             <div className="space-y-4">
//               {visibleFields.map((field, index) => (
//                 <div key={field.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative group border-l-2 border-l-emerald-500/50">
//                   <button type="button" onClick={() => removeVisible(index)} className="absolute top-4 right-4 text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input {...register(`visibleTestcases.${index}.input`)} placeholder="Input" className="bg-transparent border-b border-white/10 py-2 outline-none text-xs focus:border-emerald-500 transition-all" />
//                     <input {...register(`visibleTestcases.${index}.output`)} placeholder="Output" className="bg-transparent border-b border-white/10 py-2 outline-none text-xs focus:border-emerald-500 transition-all" />
//                   </div>
//                   <input {...register(`visibleTestcases.${index}.explaination`)} placeholder="Explanation (Optional)" className="w-full bg-transparent mt-3 text-[10px] text-slate-500 italic outline-none" />
//                 </div>
//               ))}
//               {hiddenFields.map((field, index) => (
//                 <div key={field.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative group border-l-2 border-l-rose-500/50">
//                    <button type="button" onClick={() => removeHidden(index)} className="absolute top-4 right-4 text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
//                    <div className="grid grid-cols-2 gap-4">
//                     <input {...register(`hiddenTestcases.${index}.input`)} placeholder="Secret Input" className="bg-transparent border-b border-white/10 py-2 outline-none text-xs focus:border-rose-500 transition-all" />
//                     <input {...register(`hiddenTestcases.${index}.output`)} placeholder="Secret Output" className="bg-transparent border-b border-white/10 py-2 outline-none text-xs focus:border-rose-500 transition-all" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* Right Side: Code Environments (Scrollable) */}
//         <div className="w-1/2 bg-[#080808] border-l border-white/5 overflow-y-auto p-8 space-y-12 pb-32">
//             <h2 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2 sticky top-0 bg-[#080808] py-2 z-10">
//               <Code2 size={14}/> 03. Boilerplate & Solutions
//             </h2>
            
//             {['c++', 'java', 'js'].map((lang, index) => (
//               <div key={lang} className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="h-px flex-1 bg-white/5"></div>
//                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{lang} Environment</span>
//                   <div className="h-px flex-1 bg-white/5"></div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Start Template</label>
//                     <textarea 
//                       {...register(`startCode.${index}.initialCode`)} 
//                       className="w-full bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-[11px] text-indigo-300 h-40 outline-none focus:border-indigo-500 transition-all"
//                       placeholder={`// ${lang} initial code structure...`}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Reference Solution</label>
//                     <textarea 
//                       {...register(`referenceSolution.${index}.completeCode`)} 
//                       className="w-full bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-[11px] text-emerald-400 h-40 outline-none focus:border-emerald-500 transition-all"
//                       placeholder={`// Full solution for testing...`}
//                     />
//                   </div>
//                   <input type="hidden" {...register(`startCode.${index}.language`)} value={lang} />
//                   <input type="hidden" {...register(`referenceSolution.${index}.language`)} value={lang} />
//                 </div>
//               </div>
//             ))}
//         </div>
//       </form>

//       {/* Delete Confirmation Modal (Full Overlay) */}
//       {/* {deleteModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
//           <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm rounded-2xl p-8 shadow-2xl">
//             <h2 className="text-lg font-bold text-white mb-2">Delete Permanently?</h2>
//             <p className="text-slate-500 text-xs mb-6 leading-relaxed">
//               Confirm by typing the problem title: <br/><span className="text-white font-mono font-bold select-all">{originalTitle}</span>
//             </p>
//             <input 
//               value={confirmTitle} 
//               onChange={(e) => setConfirmTitle(e.target.value)}
//               className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 mb-6 outline-none focus:border-rose-500 text-rose-500 text-sm"
//             />
//             <div className="flex gap-2">
//               <button onClick={() => setDeleteModal(false)} className="flex-1 py-2 text-xs font-bold text-slate-500">Cancel</button>
//               <button onClick={onDelete} disabled={confirmTitle !== originalTitle} className="flex-1 py-2 bg-rose-600 disabled:opacity-20 text-white rounded-lg text-xs font-bold uppercase transition-all">Destroy</button>
//             </div>
//           </div>
//         </div>
//       )} */}
//       {deleteModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
//     <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-sm rounded-2xl p-8 shadow-2xl">
//       <h2 className="text-lg font-bold text-white mb-2">Delete Permanently?</h2>
//       <p className="text-slate-500 text-xs mb-6 leading-relaxed">
//         Confirm by typing the problem title: <br/>
//         <span className="text-white font-mono font-bold select-all">{originalTitle}</span>
//       </p>
//       <input 
//         value={confirmTitle} 
//         onChange={(e) => setConfirmTitle(e.target.value)}
//         placeholder="Type title here..."
//         className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 mb-6 outline-none focus:border-rose-500 text-rose-500 text-sm"
//       />
//       <div className="flex gap-2">
//         <button 
//           onClick={() => {
//             setDeleteModal(false);
//             setConfirmTitle("");
//           }} 
//           className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-white"
//         >
//           Cancel
//         </button>
//         <button 
//           onClick={onDelete} 
//           // FIX: Extra spaces aur Case Sensitivity ko ignore karega
//           disabled={confirmTitle.trim().toLowerCase() !== originalTitle?.trim().toLowerCase()} 
//           className="flex-1 py-2 bg-rose-600 disabled:opacity-20 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase transition-all disabled:cursor-not-allowed"
//         >
//           Destroy
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }
return (
    <div className="h-screen bg-[#080B11] text-slate-300 font-sans overflow-hidden flex flex-col selection:bg-indigo-500/30">
      
      {/* Top Navigation / Modern Header Bar */}
      <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-6 bg-[#0B1329]/90 backdrop-blur-md z-50 shrink-0">
        
        {/* Left: Brand Logo & Breadcrumb Navigation */}
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
            <ChevronRight size={13} className="text-slate-600"/>
            <span className="text-slate-200 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
              {watch('title') || 'Untitled Editor'}
            </span>
          </div>
        </div>

        {/* Right: Actions & Controls */}
        <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setDeleteModal(true)} 
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" 
              title="Delete Challenge"
            >
              <Trash2 size={17}/>
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
              <Save size={14}/> Save Changes
            </button>
        </div>
      </header>

      {/* Main Split-Pane Layout */}
      <form onSubmit={handleSubmit(onUpdate)} className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Configuration & Problem Metadata */}
        <div className="w-1/2 overflow-y-auto p-8 space-y-10 border-r border-slate-800/80 custom-scrollbar pb-32">
          
          {/* Metadata Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Box size={14}/> 01. Problem Identity
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Tag</label>
                  <select {...register('tags')} className="w-full bg-[#121722]/80 border border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 text-xs font-bold text-slate-200 transition-all">
                     {['array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
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
          <section className="space-y-6">
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
              {/* Public Cases */}
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

              {/* Hidden Cases */}
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
          </section>
        </div>

        {/* Right Pane: Code Boilerplates & Solutions */}
        <div className="w-1/2 bg-[#080B11]/90 border-l border-slate-800/80 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-32">
          <div className="sticky top-0 bg-[#080B11] py-2 z-10 border-b border-slate-800/50 mb-6">
            <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Code2 size={14}/> 03. Boilerplate & Reference Code
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
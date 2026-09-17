// import { useNavigate } from 'react-router';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../../utils/axiosClient';

// // --- Validation Schema (Backend Schema ke sath Match kiya gaya hai) ---
// const ProblemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   // Backend Enum: 'array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers'
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers']),
  
//   visibleTestcases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explaination: z.string().min(1, 'Explanation is required') // Match backend spelling
//     })
//   ).min(1, 'At least one visible test case required'),

//   hiddenTestcases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),

//   startCode: z.array(
//     z.object({
//       language: z.string().min(1, 'Language is required'),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3),

//   referenceSolution: z.array(
//     z.object({
//       language: z.string().min(1, 'Language is required'),
//       completeCode: z.string().min(1, 'Complete Code is Required')
//     })
//   ).length(3),
  
//   // Isko frontend pe handle karna hoga (User ID)
//   problemCreator: z.string().optional() 
// });

// function AdminPanel() {
//   const navigate = useNavigate();
  
//   const { register, control, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(ProblemSchema),
//     defaultValues: {
//       visibleTestcases: [{ input: '', output: '', explaination: '' }],
//       hiddenTestcases: [{ input: '', output: '' }],
//       startCode: [
//         { language: 'c++', initialCode: '' },
//         { language: 'java', initialCode: '' },
//         { language: 'js', initialCode: '' }
//       ],
//       referenceSolution: [
//         { language: 'c++', completeCode: '' },
//         { language: 'java', completeCode: '' },
//         { language: 'js', completeCode: '' }
//       ]
//     }
//   });

//   const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ 
//     control, 
//     name: 'visibleTestcases' 
//   });
  
//   const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ 
//     control, 
//     name: 'hiddenTestcases' 
//   });

//   const onSubmit = async (data) => {
//     try {
//       // Note: Backend pe 'problemCreator' required hai. 
//       // Agar auth system hai toh backend khud nikal lega, warna yaha hardcode karni padegi ID.
//       const payload = {
//         ...data,
//         problemCreator: "65f1234567890abcdef12345" // Apni valid User ID yaha daal test ke liye
//       };

//       await axiosClient.post('problem/create', payload);
//       alert('Problem created Successfully!!');
//       navigate('/');
//     } catch (error) {
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-6 lg:p-12 font-sans selection:bg-indigo-500/30">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
//           <div>
//             <h1 className="text-3xl font-bold text-white tracking-tight">Create Challenge</h1>
//             <p className="text-slate-500 mt-1">Design and publish high-quality coding problems.</p>
//           </div>
//           <div className="flex gap-3 w-full md:w-auto">
//             <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost text-slate-400 hover:bg-white/5 flex-1 md:flex-none">Discard</button>
//             <button type="submit" form="main-form" className="btn bg-indigo-600 hover:bg-indigo-500 border-none text-white px-8 flex-1 md:flex-none shadow-lg shadow-indigo-600/20">
//               Publish Problem
//             </button>
//           </div>
//         </div>

//         <form id="main-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
//           {/* Section 1: Core Content */}
//           <div className="bg-[#11141b] border border-slate-800 rounded-3xl p-8 shadow-sm">
//             <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">01. Problem Definition</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
//               <div className="md:col-span-4 space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Title</label>
//                 <input {...register('title')} className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700" placeholder="e.g. Optimized Array Merging" />
//                 {errors.title && <p className="text-rose-500 text-[10px] ml-1">{errors.title.message}</p>}
//               </div>

//               <div className="md:col-span-1 space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Difficulty</label>
//                 <select {...register('difficulty')} className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 appearance-none">
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>

//               <div className="md:col-span-1 space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Tag</label>
//                 <select {...register('tags')} className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 appearance-none uppercase text-[11px]">
//                   <option value="array">Array</option>
//                   <option value="linkedList">Linked List</option>
//                   <option value="graph">Graph</option>
//                   <option value="dp">DP</option>
//                   <option value="String">String</option>
//                   <option value="Two Pointers">Two Pointers</option>
//                 </select>
//               </div>

//               <div className="md:col-span-6 space-y-2">
//                 <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Problem Description</label>
//                 <textarea {...register('description')} className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-40 transition-colors font-mono text-sm leading-relaxed" placeholder="Explain the logic..." />
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Test Environment */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//             {/* Public Cases */}
//             <div className="bg-[#11141b] border border-slate-800 rounded-3xl p-8 flex flex-col h-[600px]">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em]">02. Public Cases</h2>
//                 <button type="button" onClick={() => appendVisible({ input: '', output: '', explaination: '' })} className="text-[10px] font-bold py-1.5 px-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-all">
//                   + Add Case
//                 </button>
//               </div>
//               <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                 {visibleFields.map((field, index) => (
//                   <div key={field.id} className="bg-[#0a0c10] border border-slate-800 p-5 rounded-2xl relative border-l-2 border-l-indigo-500">
//                     <button type="button" onClick={() => removeVisible(index)} className="absolute top-3 right-3 text-slate-600 hover:text-rose-400">✕</button>
//                     <div className="space-y-3">
//                       <input {...register(`visibleTestcases.${index}.input`)} placeholder="Input" className="w-full bg-transparent border-b border-slate-800 py-1 text-sm focus:outline-none focus:border-indigo-500" />
//                       <input {...register(`visibleTestcases.${index}.output`)} placeholder="Output" className="w-full bg-transparent border-b border-slate-800 py-1 text-sm focus:outline-none focus:border-indigo-500" />
//                       <textarea {...register(`visibleTestcases.${index}.explaination`)} placeholder="Explaination" className="w-full bg-transparent py-1 text-xs text-slate-500 focus:outline-none italic h-16 resize-none" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Hidden Cases */}
//             <div className="bg-[#11141b] border border-slate-800 rounded-3xl p-8 flex flex-col h-[600px]">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em]">03. Hidden Cases</h2>
//                 <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="text-[10px] font-bold py-1.5 px-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all">
//                   + Add Case
//                 </button>
//               </div>
//               <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                 {hiddenFields.map((field, index) => (
//                   <div key={field.id} className="bg-[#0a0c10] border border-slate-800 p-5 rounded-2xl relative border-l-2 border-l-emerald-500">
//                     <button type="button" onClick={() => removeHidden(index)} className="absolute top-3 right-3 text-slate-600 hover:text-rose-400">✕</button>
//                     <div className="space-y-3">
//                       <input {...register(`hiddenTestcases.${index}.input`)} placeholder="Secret Input" className="w-full bg-transparent border-b border-slate-800 py-1 text-sm focus:outline-none focus:border-emerald-500" />
//                       <input {...register(`hiddenTestcases.${index}.output`)} placeholder="Secret Output" className="w-full bg-transparent border-b border-slate-800 py-1 text-sm focus:outline-none focus:border-emerald-500" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Section 3: Code Implementation */}
//           <div className="bg-[#11141b] border border-slate-800 rounded-3xl p-8">
//             <h2 className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">04. Code Environments</h2>
//             <div className="space-y-12">
//               {['c++', 'java', 'js'].map((lang, index) => (
//                 <div key={lang} className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <span className="text-xs font-mono font-bold text-white uppercase">{lang}</span>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <p className="text-[10px] font-bold text-slate-600 uppercase">Initial Template</p>
//                       <textarea {...register(`startCode.${index}.initialCode`)} className="w-full bg-[#0a0c10] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-300 h-64 focus:outline-none focus:border-indigo-500" />
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-[10px] font-bold text-slate-600 uppercase">Reference Solution</p>
//                       <textarea {...register(`referenceSolution.${index}.completeCode`)} className="w-full bg-[#0a0c10] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 h-64 focus:outline-none focus:border-emerald-500" />
//                     </div>
//                     {/* Hidden language field to ensure it gets sent */}
//                     <input type="hidden" {...register(`startCode.${index}.language`)} />
//                     <input type="hidden" {...register(`referenceSolution.${index}.language`)} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdminPanel;
import React from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Code2, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

// --- Validation Schema ---
const ProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'String', 'Two Pointers']),
  
  visibleTestcases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explaination: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),

  hiddenTestcases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),

  startCode: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3),

  referenceSolution: z.array(
    z.object({
      language: z.string().min(1, 'Language is required'),
      completeCode: z.string().min(1, 'Complete Code is Required')
    })
  ).length(3),
  
  problemCreator: z.string().optional() 
});

function AdminPanel() {
  const navigate = useNavigate();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      visibleTestcases: [{ input: '', output: '', explaination: '' }],
      hiddenTestcases: [{ input: '', output: '' }],
      startCode: [
        { language: 'c++', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'js', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'js', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ 
    control, 
    name: 'visibleTestcases' 
  });
  
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ 
    control, 
    name: 'hiddenTestcases' 
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        problemCreator: "65f1234567890abcdef12345" 
      };

      await axiosClient.post('problem/create', payload);
      alert('Problem created Successfully!!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      
      {/* Header Navigation Bar */}
      <header className="w-full bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: CodeCraze Logo Link */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 text-2xl font-extrabold text-white hover:opacity-90 transition-opacity no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all duration-300">
              <Code2 className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="tracking-tight">
              Code<span className="text-indigo-400">Craze</span>
            </span>
          </NavLink>

          {/* Right: Admin Panel Title */}
          <div className="text-right">
            <h1 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
              Create Challenge
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
              Design and publish high-quality coding problems
            </p>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Action Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Add Problem Details</h2>
              <p className="text-slate-400 text-sm mt-1">Fill out the required specifications and test environments.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-all flex-1 md:flex-none"
              >
                <ArrowLeft className="w-4 h-4" /> Discard
              </button>
              <button 
                type="submit" 
                form="main-form" 
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all flex-1 md:flex-none"
              >
                <Send className="w-4 h-4" /> Publish Problem
              </button>
            </div>
          </div>

          <form id="main-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Core Content */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                01. Problem Definition
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Title</label>
                  <input 
                    {...register('title')} 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder:text-slate-600 transition-all" 
                    placeholder="e.g. Optimized Array Merging" 
                  />
                  {errors.title && <p className="text-rose-400 text-xs ml-1">{errors.title.message}</p>}
                </div>

                <div className="md:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Difficulty</label>
                  <select 
                    {...register('difficulty')} 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 transition-all"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="md:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tag</label>
                  <select 
                    {...register('tags')} 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 transition-all"
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                    <option value="String">String</option>
                    <option value="Two Pointers">Two Pointers</option>
                  </select>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Problem Description</label>
                  <textarea 
                    {...register('description')} 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-40 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 transition-all resize-none" 
                    placeholder="Explain the problem requirements..." 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Test Environment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Public Cases */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col h-[550px] backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                    02. Public Cases
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => appendVisible({ input: '', output: '', explaination: '' })} 
                    className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Case
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl relative border-l-4 border-l-indigo-500">
                      <button 
                        type="button" 
                        onClick={() => removeVisible(index)} 
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <input 
                          {...register(`visibleTestcases.${index}.input`)} 
                          placeholder="Input" 
                          className="w-full bg-transparent border-b border-slate-800 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                        />
                        <input 
                          {...register(`visibleTestcases.${index}.output`)} 
                          placeholder="Output" 
                          className="w-full bg-transparent border-b border-slate-800 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200" 
                        />
                        <textarea 
                          {...register(`visibleTestcases.${index}.explaination`)} 
                          placeholder="Explanation" 
                          className="w-full bg-transparent py-1 text-xs text-slate-400 focus:outline-none italic h-14 resize-none" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Cases */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col h-[550px] backdrop-blur-sm shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
                    03. Hidden Cases
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => appendHidden({ input: '', output: '' })} 
                    className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-xl hover:bg-sky-500/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Case
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl relative border-l-4 border-l-sky-500">
                      <button 
                        type="button" 
                        onClick={() => removeHidden(index)} 
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <input 
                          {...register(`hiddenTestcases.${index}.input`)} 
                          placeholder="Secret Input" 
                          className="w-full bg-transparent border-b border-slate-800 py-1.5 text-sm focus:outline-none focus:border-sky-500 text-slate-200" 
                        />
                        <input 
                          {...register(`hiddenTestcases.${index}.output`)} 
                          placeholder="Secret Output" 
                          className="w-full bg-transparent border-b border-slate-800 py-1.5 text-sm focus:outline-none focus:border-sky-500 text-slate-200" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Section 3: Code Implementation */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                04. Code Environments
              </h3>
              
              <div className="space-y-10">
                {['c++', 'java', 'js'].map((lang, index) => (
                  <div key={lang} className="space-y-3 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase">
                        {lang}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Template</p>
                        <textarea 
                          {...register(`startCode.${index}.initialCode`)} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300 h-56 focus:outline-none focus:border-indigo-500 transition-all resize-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference Solution</p>
                        <textarea 
                          {...register(`referenceSolution.${index}.completeCode`)} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-400 h-56 focus:outline-none focus:border-indigo-500 transition-all resize-none" 
                        />
                      </div>
                      
                      <input type="hidden" {...register(`startCode.${index}.language`)} />
                      <input type="hidden" {...register(`referenceSolution.${index}.language`)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
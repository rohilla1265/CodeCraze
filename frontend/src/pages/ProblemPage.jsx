// import { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// // import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import Editor from '@monaco-editor/react';
// import { useParams } from 'react-router';
// import { NavLink } from 'react-router';
// import axiosClient from "../../utils/axiosClient";
// import ChatAi from '../components/chatai';
// import Editorial from '../components/Editorial';
// import { useSelector } from 'react-redux';
// const ProblemPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');
//   const [submissions, setSubmissions] = useState([]);
//   const editorRef = useRef(null);
//   let { problemId } = useParams();
//   const [selectedSubmission, setSelectedSubmission] = useState(null); // Clicked submission save karne ke liye
// const [copied, setCopied] = useState(false);

// const handleCopyCode = (codeText) => {
//   navigator.clipboard.writeText(codeText);
//   setCopied(true);
//   setTimeout(() => setCopied(false), 2000); // 2 second baad 'Copied' text hat jayega
// };
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return 'bg-green-100 text-green-700';
//       case 'medium': return 'bg-yellow-100 text-yellow-700';
//       case 'hard': return 'bg-red-100 text-red-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getLanguageForMonaco = (lang) => {
//     switch (lang) {
//       case 'javascript': return 'javascript';
//       case 'java': return 'java';
//       case 'cpp': return 'cpp';
//       default: return 'javascript';
//     }
//   };

//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/${problemId}`);
//         setProblem(response.data);
//         const initial = response.data.startCode.find((sc) => {
//           const apiLang = sc.language.toLowerCase();
//           const currentLang = selectedLanguage.toLowerCase();
//           return apiLang === currentLang || (apiLang === 'c++' && currentLang === 'cpp');
//         })?.initialCode || '';
//         setCode(initial);
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);
//   // Jab bhi user 'submissions' tab par click kare, tab data fetch ho:
// useEffect(() => {
//     const fetchSubmissions = async () => {
//         try {
//             // problem?._id aapke parent component se aane wali ID honi chahiye
//             const response = await axiosClient.get(`/problem/solutions/${problem?._id}`); 
//             if (response.data.success) {
//                 setSubmissions(response.data.submissions);
//             }
//         } catch (err) {
//             console.error("Error fetching submissions:", err);
//         }
//     };

//     if (activeLeftTab === 'submissions' && problem?._id) {
//         fetchSubmissions();
//     }
// }, [activeLeftTab, problem?._id]);

//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode.find(sc => {
//         const apiLang = sc.language.toLowerCase();
//         const currentLang = selectedLanguage.toLowerCase();
//         return apiLang === currentLang || (apiLang === 'c++' && currentLang === 'cpp');
//       })?.initialCode || '';
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//       setRunResult(response.data);
//       setActiveRightTab('testcase');
//     } catch (error) {
//       setRunResult({ status: 'error', errorMessage: 'Internal server error' });
//       setActiveRightTab('testcase');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);
//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
//       setSubmitResult(response.data);
//       setActiveRightTab('result');
//     } catch (error) {
//       console.error('Error submitting code:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="flex h-screen w-screen justify-center items-center bg-base-200 text-indigo-500">
//         <span className="loading loading-dots loading-lg"></span>
//       </div>
//     );
//   }

//   return (

//     <div className="h-screen flex flex-col bg-base-200 overflow-hidden p-2 gap-2">
//       <nav className="border-b border-slate-800 bg-[#11141b]/50 backdrop-blur-md shrink-0">
//         <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-6">
//             <NavLink to="/" className="text-xl font-bold text-white tracking-tighter">
//               CODE<span className="text-indigo-500">LAB</span>
//             </NavLink>
//             <NavLink to="/" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
//               Problems
//             </NavLink>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-[10px] font-mono text-slate-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
//               {user?.firstname || 'Guest'}
//             </span>
//           </div>
//         </div>
//       </nav>
//       <div className="flex-1 flex gap-2 overflow-hidden">

//         {/* Left Panel: Description */}
//         <div className="w-1/2 flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
//           <div className="flex bg-base-100 border-b border-base-300 p-1 gap-1">
//             {['description', 'editorial', 'solutions', 'submissions', 'ChatAI'].map(tab => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${activeLeftTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-base-200'}`}
//                 onClick={() => setActiveLeftTab(tab)}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
//             {problem && activeLeftTab === 'description' && (
//               <div className="animate-in fade-in duration-500">
//                 <div className="flex items-center justify-between mb-6">
//                   <h1 className="text-2xl font-extrabold text-base-content">{problem.title}</h1>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDifficultyColor(problem.difficulty)}`}>
//                     {problem.difficulty}
//                   </span>
//                 </div>
//                 <div className="flex gap-2 mb-6">
//                   {problem.tags?.split(',').map(tag => (
//                     <span key={tag} className="badge badge-ghost badge-sm py-3 px-3">{tag}</span>
//                   ))}
//                 </div>
//                 <div className="prose max-w-none text-base-content/80 text-sm leading-relaxed mb-10">
//                   {problem.description}
//                 </div>
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-bold border-l-4 border-indigo-500 pl-3 text-base-content">Examples</h3>
//                   {problem.visibleTestcases?.map((example, index) => (
//                     <div key={index} className="bg-base-200/50 border border-base-300 p-4 rounded-xl">
//                       <div className="grid gap-2 text-sm font-mono">
//                         <p><span className="text-indigo-500 font-bold">Input:</span> {example.input}</p>
//                         <p><span className="text-indigo-500 font-bold">Output:</span> {example.output}</p>
//                         {example.explaination && <p className="text-base-content/60 italic mt-1">Explanation: {example.explaination}</p>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {activeLeftTab === 'editorial' && (
//               <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold mb-4">Editorial</h2>
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//   <Editorial 
//     secureurl={problem?.secureurl} 
//     thumbnail={problem?.thumbnail} 
//     duration={problem?.duration}
//   />
// </div>
//                 </div>
//             )}
//            {activeLeftTab === 'submissions' && (
//   <div className="p-4 bg-base-100 rounded-xl relative">
//     <h3 className="text-lg font-bold mb-4">Past Submissions ({submissions?.length || 0})</h3>
    
//     {!submissions || submissions.length === 0 ? (
//       <p className="text-sm text-base-content/60">No submissions found for this problem.</p>
//     ) : (
//       <div className="overflow-x-auto">
//         <table className="table w-full border-collapse">
//           <thead>
//             <tr className="border-b border-base-300">
//               <th className="text-left p-2">Status</th>
//               <th className="text-left p-2">Language</th>
//               <th className="text-left p-2">Runtime</th>
//               <th className="text-left p-2">Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {submissions.map((sub) => (
//               <tr 
//                 key={sub._id} 
//                 className="border-b border-base-200 hover:bg-base-200/70 cursor-pointer transition-colors"
//                 onClick={() => setSelectedSubmission(sub)} // Click karne par modal khulega
//               >
//                 <td className="p-2 font-semibold">
//                   <span className={
//                     sub.status === 'accepted' ? 'text-green-500' : 
//                     sub.status === 'wrong' ? 'text-red-500' : 'text-warning'
//                   }>
//                     {sub.status.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="p-2"><span className="badge badge-sm badge-ghost">{sub.language}</span></td>
//                 <td className="p-2 text-base-content/70">{sub.runtime} ms</td>
//                 <td className="p-2 text-xs text-base-content/60">
//                   {new Date(sub.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )}

//     {/* --- CODE VIEWER MODAL (LEETCODE STYLE) --- */}
//     {selectedSubmission && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
//         <div className="bg-neutral text-neutral-content w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden m-4 border border-base-300">
          
//           {/* Modal Header */}
//           <div className="flex justify-between items-center p-4 bg-base-300 border-b border-base-200">
//             <div className="flex items-center gap-3">
//               <span className={`text-md font-bold ${selectedSubmission.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
//                 {selectedSubmission.status.toUpperCase()}
//               </span>
//               <span className="badge badge-outline">{selectedSubmission.language}</span>
//               <span className="text-xs text-base-content/70">{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
//             </div>
            
//             {/* Close Button */}
//             <button 
//               className="btn btn-sm btn-circle btn-ghost"
//               onClick={() => setSelectedSubmission(null)}
//             >✕</button>
//           </div>

//           {/* Modal Body (Code View) */}
//           <div className="p-4 relative max-h-[60vh] overflow-y-auto bg-stone-950 font-mono text-sm leading-relaxed text-stone-200">
            
//             {/* Copy Action Button */}
//             <button 
//               className="absolute top-4 right-4 btn btn-xs btn-primary gap-1 Normal-case"
//               onClick={() => handleCopyCode(selectedSubmission.code)}
//             >
//               {copied ? (
//                 <span className="text-green-400 font-sans">✓ Copied!</span>
//               ) : (
//                 <span>Copy Code</span>
//               )}
//             </button>

//             {/* Code Content */}
//             <pre className="whitespace-pre-wrap pt-6">{selectedSubmission.code}</pre>
//           </div>
          
//         </div>
//       </div>
//     )}
//   </div>
// )}
//             {activeLeftTab === 'ChatAI' && (
//               <div className="prose max-w-none">
//                 <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
//                 <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                   <ChatAi problem={problem}></ChatAi>
//                 </div>
//               </div>
//             )}
//             {activeLeftTab === 'solutions' && (
//               <div className="space-y-4">
//                 {problem?.referenceSolution?.map((sol, i) => (
//                   <div key={i} className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
//                     <input type="radio" name="solution-accordion" defaultChecked={i === 0} />
//                     <div className="collapse-title font-bold text-sm">{sol.language.toUpperCase()} Solution</div>
//                     <div className="collapse-content overflow-x-auto">
//                       <pre className="text-xs p-2 bg-neutral text-neutral-content rounded-lg"><code>{sol.completeCode}</code></pre>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Panel: Editor & Results */}
//         <div className="w-1/2 flex flex-col gap-2">

//           {/* Editor Container */}
//           <div className="flex-1 flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
//             <div className="flex items-center justify-between p-2 bg-base-100 border-b border-base-300">
//               <div className="flex gap-1">
//                 {['javascript', 'java', 'cpp'].map((lang) => (
//                   <button
//                     key={lang}
//                     className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedLanguage === lang ? 'bg-indigo-600 text-white' : 'hover:bg-base-200'}`}
//                     onClick={() => setSelectedLanguage(lang)}
//                   >
//                     {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex gap-2">
//                 <button className="btn btn-ghost btn-xs">Reset</button>
//               </div>
//             </div>

//             <div className="flex-1 relative">
//               <Editor
//                 height="100%"
//                 language={getLanguageForMonaco(selectedLanguage)}
//                 value={code}
//                 theme="vs-dark"
//                 onChange={(val) => setCode(val || '')}
//                 options={{
//                   fontSize: 14,
//                   minimap: { enabled: false },
//                   padding: { top: 10 },
//                   roundedSelection: true,
//                   scrollBeyondLastLine: false,
//                   cursorSmoothCaretAnimation: "on"
//                 }}
//               />
//             </div>

//             <div className="p-3 border-t border-base-300 flex justify-between items-center bg-base-100">
//               <button className={`btn btn-sm btn-ghost gap-2 ${activeRightTab === 'testcase' ? 'text-indigo-500' : ''}`} onClick={() => setActiveRightTab('testcase')}>
//                 Console {runResult && <span className="badge badge-xs bg-indigo-500"></span>}
//               </button>
//               <div className="flex gap-2">
//                 <button className="btn btn-outline btn-sm px-6 border-base-300" onClick={handleRun} disabled={loading}>
//                   {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Run'}
//                 </button>
//                 <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none btn-sm px-6 shadow-lg shadow-indigo-600/20" onClick={handleSubmitCode} disabled={loading}>
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Results Drawer (Conditionally rendered but fixed size or integrated) */}
//           <div className="h-1/3 bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden flex flex-col">
//             <div className="tabs tabs-boxed bg-transparent p-1 gap-2 border-b border-base-300 rounded-none">
//               <button className={`tab tab-sm ${activeRightTab === 'testcase' ? 'tab-active !bg-base-300' : ''}`} onClick={() => setActiveRightTab('testcase')}>Testcase</button>
//               <button className={`tab tab-sm ${activeRightTab === 'result' ? 'tab-active !bg-base-300' : ''}`} onClick={() => setActiveRightTab('result')}>Result</button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 bg-base-100">
//               {activeRightTab === 'testcase' && (
//                 <div>
//                   {!runResult ? (
//                     <p className="text-gray-400 text-sm italic">Run code to see test case results...</p>
//                   ) : (
//                     <div className="animate-in slide-in-from-bottom-2 duration-300">
//                       <div className={`p-4 rounded-xl ${runResult.status === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                         <h4 className={`font-bold flex items-center gap-2 ${runResult.status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
//                           {runResult.status === 'accepted' ? '✅ All test cases passed!' : `❌ ${runResult.status.toUpperCase()}`}
//                         </h4>
//                         {runResult.status === 'accepted' && (
//                           <div className="mt-2 text-xs flex gap-4 text-green-600 font-medium">
//                             <span>Runtime: {runResult.runtime}s</span>
//                             <span>Memory: {runResult.memory} KB</span>
//                           </div>
//                         )}
//                         {!runResult.status === 'accepted' && runResult.errorMessage && (
//                           <pre className="mt-2 text-xs bg-red-100 p-2 rounded text-red-600 overflow-x-auto">{runResult.errorMessage}</pre>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {activeRightTab === 'result' && (
//                 <div className="animate-in slide-in-from-bottom-2 duration-300">
//                   {!submitResult ? (
//                     <p className="text-gray-400 text-sm italic">No submissions yet.</p>
//                   ) : (
//                     <div className={`p-4 rounded-xl ${submitResult.status === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                       <h4 className="font-extrabold text-lg flex items-center gap-2">
//                         {submitResult.status === 'accepted' ? <span className="text-green-600">Accepted 🎉</span> : <span className="text-red-600">Rejected ❌</span>}
//                       </h4>
//                       <div className="mt-2 space-y-1 text-sm font-medium">
//                         <p>Passed: <span className="font-bold">{submitResult.testCasesPassed} / {submitResult.testCasesTotal}</span></p>
//                         <p className="text-xs opacity-70 text-base-content">Runtime: {submitResult.runtime}s</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;


import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, NavLink } from 'react-router';
import axiosClient from "../../utils/axiosClient";
import ChatAi from '../components/chatai';
import Editorial from '../components/Editorial';
import { useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { Code2 } from 'lucide-react';

// const ProblemPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { problemId } = useParams();

//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [executionType, setExecutionType] = useState('');
  
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('testcase');
//   const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);

//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [copied, setCopied] = useState(false);

//   const triggerInlineConfetti = () => {
//     confetti({
//       particleCount: 120,
//       spread: 80,
//       origin: { y: 0.85, x: 0.88 },
//       colors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899']
//     });
//   };

//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(`/problem/${problemId}`);
//         setProblem(response.data);
        
//         const initial = response.data.startCode?.find((sc) => {
//           const apiLang = sc.language.toLowerCase();
//           const currentLang = selectedLanguage.toLowerCase();
//           return apiLang === currentLang || (apiLang === 'C++' && currentLang === 'cpp');
//         })?.initialCode || '';
//         setCode(initial);
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode?.find(sc => {
//         const apiLang = sc.language.toLowerCase();
//         const currentLang = selectedLanguage.toLowerCase();
//         return apiLang === currentLang || (apiLang === 'C++' && currentLang === 'cpp');
//       })?.initialCode || '';
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       if (!problem?._id) return;
//       try {
//         const response = await axiosClient.get(`/problem/solutions/${problem._id}`);
//         if (response.data?.success) {
//           setSubmissions(response.data.submissions || []);
//         } else if (Array.isArray(response.data)) {
//           setSubmissions(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching submissions:", err);
//       }
//     };

//     if (activeLeftTab === 'submissions') {
//       fetchSubmissions();
//     }
//   }, [activeLeftTab, problem?._id]);

//   // const handleRun = async () => {
//   //   setLoading(true);
//   //   setExecutionType('run');
//   //   setRunResult(null);
//   //   setActiveRightTab('testcase');

//   //   try {
//   //     const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//   //     setRunResult(response.data);
//   //   } catch (error) {
//   //     setRunResult({ 
//   //       status: 'error', 
//   //       errorMessage: error.response?.data?.message || 'Execution Error' 
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //     setExecutionType('');
//   //   }
//   // };
//   const handleRun = async () => {
//     setLoading(true);
//     setExecutionType('run');
//     setRunResult(null);
//     setActiveRightTab('testcase');

//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
//       // Change 1: Directly results array/data save karein
//       setRunResult(response.data.results);
//     } catch (error) {
//       setRunResult({ 
//         status: 'error', 
//         errorMessage: error.response?.data?.message || 'Execution Error' 
//       });
//     } finally {
//       setLoading(false);
//       // Change 2: executionType reset mat karein taaki UI loader/state maintain rahe
//       // setExecutionType(''); 
//     }
// };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setExecutionType('submit');
//     setSubmitResult(null);
//     setActiveRightTab('result');

//     try {
//       const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
//       setSubmitResult(response.data);

//       if (response.data?.status === 'accepted') {
//         triggerInlineConfetti();
//       }
//     } catch (error) {
//       setSubmitResult({
//         status: 'error',
//         errorMessage: error.response?.data?.message || 'Submission failed'
//       });
//     } finally {
//       setLoading(false);
//       setExecutionType('');
//     }
//   };

//   const handleCopyCode = (codeText) => {
//     navigator.clipboard.writeText(codeText);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // Helper to safely extract user output key
//   // const getUserOutput = (index) => {
//   //   if (!runResult) return null;
//   //   if (runResult.testResults && runResult.testResults[index]) {
//   //     const res = runResult.testResults[index];
//   //     return res.userOutput ?? res.stdout ?? res.output ?? res.actualOutput ?? (typeof res === 'string' ? res : null);
//   //   }
//   //   if (runResult.userOutput) return runResult.userOutput;
//   //   if (runResult.stdout) return runResult.stdout;
//   //   if (runResult.output) return runResult.output;
//   //   return runResult.errorMessage || null;
//   // };
//   const getUserOutput = (index) => {
//     if (!runResult) return null; // Jab tak Run button click nahi hua, tab tak null rahega

//     const res = Array.isArray(runResult) ? runResult[index] : (runResult.results?.[index] || runResult.testResults?.[index]);

//     if (!res) return runResult.errorMessage || "No response data";

//     // 1. Errors Check
//     if (res.compile_output) return res.compile_output;
//     if (res.stderr) return res.stderr;

//     // 2. Output Check (Khaali string ko bhi "No Output" dikhayega, null return nahi karega)
//     const output = res.stdout ?? res.output ?? res.userOutput;
//     if (output !== undefined && output !== null) {
//         return output.trim() === "" ? "(No Output / Blank)" : output;
//     }

//     // 3. Fallback Status (e.g. Accepted, Time Limit Exceeded)
//     return res.status?.description || "Execution Completed";
// };
//   return (
//     <div className="h-screen flex flex-col bg-[#0b0e14] text-slate-300 font-sans p-3 gap-3 overflow-hidden select-none">
      
//       {/* Header Navbar */}
//       <nav className="h-12 bg-[#121722] border border-slate-800/80 rounded-2xl px-5 flex justify-between items-center shadow-lg">
//         <div className="flex items-center gap-6">
//           <NavLink to="/" className="flex items-center gap-2 font-black tracking-wider text-white text-lg">
//             <span>CODE</span>
//             <span className="text-indigo-400 italic">PUR</span>
//           </NavLink>
//           <NavLink to="/" className="text-xs font-semibold text-slate-300 bg-[#1a2130] border border-slate-700/50 px-3.5 py-1.5 rounded-xl hover:border-indigo-500/50 transition-all">
//             Problem Set
//           </NavLink>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2.5 bg-[#1a2130] border border-slate-700/50 px-3.5 py-1.5 rounded-xl text-xs text-slate-200">
//             <div className="w-5 h-5 rounded-full bg-indigo-600/40 border border-indigo-400/60 flex items-center justify-center text-[10px] font-bold text-indigo-200">
//               {user?.firstname?.[0] || 'A'}
//             </div>
//             <span className="font-medium">{user?.firstname || 'User'}</span>
//           </div>
//         </div>
//       </nav>

//       {/* Main Workspace Layout */}
//       <div className="flex-1 flex gap-3 overflow-hidden">

//         {/* Left Side Panel */}
//         <div className="w-1/2 flex flex-col bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
//           <div className="flex bg-[#0d111a] border-b border-slate-800/80 p-2 gap-2">
//             {['description', 'editorial', 'solutions', 'submissions', 'ChatAI'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveLeftTab(tab)}
//                 className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
//                   activeLeftTab === tab
//                     ? 'bg-[#1e2638] text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
//                     : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2130]/50'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
//             {problem && activeLeftTab === 'description' && (
//               <>
//                 <div className="flex justify-between items-center bg-[#181f2e] border border-slate-700/40 p-4 rounded-2xl shadow-inner">
//                   <h1 className="text-lg font-bold text-white tracking-wide">{problem.title}</h1>
//                   <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase ${
//                     problem.difficulty?.toLowerCase() === 'easy' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
//                     problem.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
//                     'bg-rose-500/15 text-rose-400 border-rose-500/30'
//                   }`}>
//                     {problem.difficulty || 'Easy'}
//                   </span>
//                 </div>

//                 <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d111a]/80 p-4 rounded-2xl border border-slate-800/80">
//                   {problem.description}
//                 </div>

//                 {problem.visibleTestcases && problem.visibleTestcases.length > 0 && (
//                   <div className="space-y-3">
//                     <h3 className="text-xs font-bold text-slate-300 tracking-wider">EXAMPLES</h3>
//                     {problem.visibleTestcases.map((example, idx) => (
//                       <div key={idx} className="bg-[#0d111a] border border-slate-800/80 rounded-2xl p-3.5 font-mono text-xs space-y-1.5 shadow-md">
//                         <div><span className="text-indigo-400 font-bold">Input:</span> <span className="text-slate-300">{example.input}</span></div>
//                         <div><span className="text-emerald-400 font-bold">Output:</span> <span className="text-slate-300">{example.output}</span></div>
//                         {example.explaination && (
//                           <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
//                             Explanation: {example.explaination}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {problem.tags && (
//                   <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
//                     {problem.tags.split(',').map((tag) => (
//                       <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-xl bg-[#1a2130] text-slate-300 border border-slate-700/50">
//                         {tag.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}

//             {activeLeftTab === 'submissions' && (
//               <div className="space-y-3">
//                 <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submissions History</h3>
//                 {submissions.length === 0 ? (
//                   <div className="text-xs text-slate-500 italic p-4 text-center bg-[#0d111a] rounded-2xl border border-slate-800/80">
//                     No past submissions found for this problem.
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#0d111a]">
//                     <table className="w-full text-xs text-left font-mono">
//                       <thead className="bg-[#181f2e] text-slate-400 border-b border-slate-800 text-[11px]">
//                         <tr>
//                           <th className="p-3">Status</th>
//                           <th className="p-3">Language</th>
//                           <th className="p-3">Runtime</th>
//                           <th className="p-3">Submitted</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-800/60">
//                         {submissions.map((sub) => (
//                           <tr 
//                             key={sub._id} 
//                             onClick={() => setSelectedSubmission(sub)}
//                             className="hover:bg-[#181f2e]/60 cursor-pointer transition-colors"
//                           >
//                             <td className="p-3 font-bold">
//                               <span className={sub.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}>
//                                 {sub.status?.toUpperCase()}
//                               </span>
//                             </td>
//                             <td className="p-3 text-slate-300">{sub.language}</td>
//                             <td className="p-3 text-slate-400">{sub.runtime ? `${sub.runtime} ms` : 'N/A'}</td>
//                             <td className="p-3 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeLeftTab === 'solutions' && (
//               <div className="space-y-4">
//                 {problem?.referenceSolution?.map((sol, i) => (
//                   <div key={i} className="bg-[#0d111a] border border-slate-800/80 rounded-2xl p-3.5">
//                     <div className="text-xs font-bold text-indigo-400 mb-2 uppercase">{sol.language} Solution</div>
//                     <pre className="text-xs font-mono p-3 bg-[#080a0f] rounded-xl border border-slate-800/60 text-slate-300 overflow-x-auto">
//                       <code>{sol.completeCode}</code>
//                     </pre>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeLeftTab === 'editorial' && <Editorial secureurl={problem?.secureurl} thumbnail={problem?.thumbnail} duration={problem?.duration} />}
//             {activeLeftTab === 'ChatAI' && <ChatAi problem={problem} />}
//           </div>
//         </div>

//         {/* Right Side Editor & Console */}
//         <div className="w-1/2 flex flex-col gap-3">
          
//           <div className="flex-1 flex flex-col bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
//             <div className="flex justify-between items-center px-4 py-2.5 bg-[#0d111a] border-b border-slate-800/80">
//               <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Editor
//               </span>
//               <select
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 className="bg-[#1a2130] text-indigo-200 border border-slate-700/50 text-xs px-3 py-1 rounded-xl outline-none cursor-pointer"
//               >
//                 <option value="javascript">JavaScript</option>
//                 <option value="java">Java</option>
//                 <option value="cpp">C++</option>
//               </select>
//             </div>

//             <div className="flex-1 relative">
//               <Editor
//                 height="100%"
//                 language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
//                 value={code}
//                 theme="vs-dark"
//                 onChange={(v) => setCode(v || '')}
//                 options={{
//                   fontSize: 13,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   fontFamily: "Fira Code, monospace",
//                 }}
//               />
//             </div>
//           </div>

//           {/* Console Area */}
//           <div className={`h-[42%] bg-[#121722] border rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all ${
//             loading ? 'border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : 'border-slate-800/80'
//           }`}>
            
//             <div className="flex justify-between items-center px-3 py-2 bg-[#0d111a] border-b border-slate-800/80">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setActiveRightTab('testcase')}
//                   className={`px-3.5 py-1 text-xs font-semibold rounded-xl transition-all ${
//                     activeRightTab === 'testcase' ? 'text-indigo-300 bg-[#1e2638] border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
//                   }`}
//                 >
//                   Testcase Results
//                 </button>
//                 <button
//                   onClick={() => setActiveRightTab('result')}
//                   className={`px-3.5 py-1 text-xs font-semibold rounded-xl transition-all ${
//                     activeRightTab === 'result' ? 'text-indigo-300 bg-[#1e2638] border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
//                   }`}
//                 >
//                   Submission Result
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs relative">
              
//               {loading && (
//                 <div className="absolute inset-0 bg-[#0d111a]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
//                   <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
//                   <span className="text-xs font-bold text-indigo-300 animate-pulse tracking-wider">
//                     {executionType === 'run' ? 'EXECUTING TESTCASES...' : 'EVALUATING SUBMISSION...'}
//                   </span>
//                 </div>
//               )}

//               {/* TESTCASES TAB */}
//               {activeRightTab === 'testcase' && (
//                 <div>
//                   {problem?.visibleTestcases && problem.visibleTestcases.length > 0 ? (
//                     <div className="space-y-3">
//                       <div className="flex gap-2 border-b border-slate-800/80 pb-2">
//                         {problem.visibleTestcases.map((_, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setActiveTestCaseTab(idx)}
//                             className={`px-3 py-1 text-[11px] rounded-lg font-medium transition-all ${
//                               activeTestCaseTab === idx 
//                                 ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
//                                 : 'bg-[#181f2e] text-slate-400 hover:text-slate-200'
//                             }`}
//                           >
//                             Case {idx + 1}
//                           </button>
//                         ))}
//                       </div>

//                       {problem.visibleTestcases[activeTestCaseTab] && (
//                         <div className="space-y-2">
//                           <div>
//                             <span className="text-slate-500 text-[10px] block mb-1">Input:</span>
//                             <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-slate-300">
//                               {problem.visibleTestcases[activeTestCaseTab].input}
//                             </div>
//                           </div>

//                           <div>
//                             <span className="text-slate-500 text-[10px] block mb-1">Expected Output:</span>
//                             <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-emerald-400">
//                               {problem.visibleTestcases[activeTestCaseTab].output}
//                             </div>
//                           </div>

//                           <div>
//                             <span className="text-slate-500 text-[10px] block mb-1">Your Output:</span>
//                             <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-indigo-300 font-bold">
//                               {getUserOutput(activeTestCaseTab) !== null ? (
//                                 getUserOutput(activeTestCaseTab)
//                               ) : (
//                                 <span className="text-slate-600 italic font-normal">Run code to see output</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-slate-500 italic">No visible test cases available for this problem.</div>
//                   )}
//                 </div>
//               )}

//               {/* REDESIGNED SUBMISSION RESULT TAB */}
//               {activeRightTab === 'result' && (
//                 <div>
//                   {!submitResult ? (
//                     <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
//                       <div className="w-10 h-10 rounded-full bg-[#181f2e] border border-slate-800 flex items-center justify-center text-slate-500">
//                         ⚡
//                       </div>
//                       <p className="text-slate-400 font-sans text-xs">Ready for submission evaluation</p>
//                       <p className="text-slate-600 font-sans text-[11px]">Click "Submit" below to evaluate your solution against all test cases.</p>
//                     </div>
//                   ) : submitResult.status === 'accepted' ? (
//                     <div className="space-y-4">
//                       {/* Accepted Banner */}
//                       <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
//                             ✓
//                           </div>
//                           <div>
//                             <h4 className="text-emerald-400 font-bold text-sm tracking-wide">Accepted</h4>
//                             <p className="text-slate-400 text-[11px]">All test cases passed successfully!</p>
//                           </div>
//                         </div>
//                         <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
//                           {submitResult.testCasesPassed || submitResult.testCasesTotal || 'All'} / {submitResult.testCasesTotal || 'All'} Passed
//                         </span>
//                       </div>

//                       {/* Performance Cards */}
//                       <div className="grid grid-cols-2 gap-3 font-sans">
//                         <div className="bg-[#080a0f] border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
//                           <span className="text-[10px] text-slate-500 uppercase tracking-wider">Runtime</span>
//                           <div className="text-base font-bold text-white mt-1">
//                             {submitResult.runtime || '12'} <span className="text-xs font-normal text-slate-400">ms</span>
//                           </div>
//                           <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
//                             <div className="bg-indigo-500 h-full w-[85%] rounded-full"></div>
//                           </div>
//                         </div>

//                         <div className="bg-[#080a0f] border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
//                           <span className="text-[10px] text-slate-500 uppercase tracking-wider">Memory</span>
//                           <div className="text-base font-bold text-white mt-1">
//                             {submitResult.memory || '42.1'} <span className="text-xs font-normal text-slate-400">MB</span>
//                           </div>
//                           <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
//                             <div className="bg-emerald-500 h-full w-[70%] rounded-full"></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {/* Rejected Banner */}
//                       <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 font-bold text-sm">
//                             ✕
//                           </div>
//                           <div>
//                             <h4 className="text-rose-400 font-bold text-sm tracking-wide">
//                               {submitResult.status?.toUpperCase() || 'WRONG ANSWER'}
//                             </h4>
//                             <p className="text-slate-400 text-[11px]">Submission failed evaluation.</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Error Message Container */}
//                       <div className="bg-[#080a0f] border border-slate-800/80 p-3.5 rounded-2xl">
//                         <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Details / Error Log:</span>
//                         <p className="text-rose-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
//                           {submitResult.errorMessage || submitResult.error || 'One or more hidden testcases failed.'}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Bottom Bar */}
//             <div className="p-3 bg-[#0d111a] border-t border-slate-800/80 flex justify-end items-center gap-3">
//               <button
//                 onClick={handleRun}
//                 disabled={loading}
//                 className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#181f2e] border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
//               >
//                 {loading && executionType === 'run' ? 'RUNNING...' : 'RUN CODE'}
//               </button>
              
//               <button
//                 onClick={handleSubmitCode}
//                 disabled={loading}
//                 className="px-6 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer"
//               >
//                 {loading && executionType === 'submit' ? 'SUBMITTING...' : 'SUBMIT'}
//               </button>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* Code Modal */}
//       {selectedSubmission && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//           <div className="bg-[#121722] border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
//             <div className="flex justify-between items-center p-4 bg-[#0d111a] border-b border-slate-800/80">
//               <span className={`text-xs font-bold ${selectedSubmission.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
//                 SUBMISSION CODE
//               </span>
//               <button className="text-slate-400 hover:text-white text-sm" onClick={() => setSelectedSubmission(null)}>✕</button>
//             </div>
//             <div className="p-4 bg-[#080a0f] relative max-h-[60vh] overflow-y-auto font-mono text-xs text-slate-300">
//               <button 
//                 onClick={() => handleCopyCode(selectedSubmission.code)} 
//                 className="absolute top-3 right-3 text-[10px] bg-indigo-600 px-2.5 py-1 rounded-lg text-white font-sans"
//               >
//                 {copied ? 'Copied!' : 'Copy Code'}
//               </button>
//               <pre className="pt-4"><code>{selectedSubmission.code}</code></pre>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };
// import React, { useState, useEffect } from 'react';
// import { NavLink, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Editor from '@monaco-editor/react';
// import confetti from 'canvas-confetti';
// import axiosClient from '../api/axiosClient'; // Update import path if needed

const ProblemPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [executionType, setExecutionType] = useState('');

  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('testcase');
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  const triggerInlineConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.85, x: 0.88 },
      colors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899']
    });
  };

  // Helper function to match starter code with selected language
  const getInitialCodeForLanguage = (problemData, lang) => {
  if (!problemData?.startCode || !Array.isArray(problemData.startCode)) return '';

  const currentLang = lang.toLowerCase().trim();

  const match = problemData.startCode.find((sc) => {
    const apiLang = sc.language?.toLowerCase().trim();
    
    // JS / JavaScript mapping fix
    if ((currentLang === 'javascript' || currentLang === 'js') && (apiLang === 'js' || apiLang === 'javascript')) {
      return true;
    }
    
    // C++ mapping fix
    if ((currentLang === 'c++' || currentLang === 'cpp') && (apiLang === 'c++' || apiLang === 'cpp')) {
      return true;
    }

    return apiLang === currentLang;
  });

  return match ? (match.initialCode || match.completeCode || match.code || '') : '';
};

  // Fetch Problem Details
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/${problemId}`);
        const data = response.data;
        setProblem(data);
        setCode(getInitialCodeForLanguage(data, selectedLanguage));
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Update Code Template on Language Switch
  useEffect(() => {
    if (problem) {
      setCode(getInitialCodeForLanguage(problem, selectedLanguage));
    }
  }, [selectedLanguage]);

  // Fetch Submissions History
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!problem?._id) return;
      try {
        const response = await axiosClient.get(`/problem/solutions/${problem._id}`);
        if (response.data?.success) {
          setSubmissions(response.data.submissions || []);
        } else if (Array.isArray(response.data)) {
          setSubmissions(response.data);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    if (activeLeftTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeLeftTab, problem?._id]);

  const handleRun = async () => {
    setLoading(true);
    setExecutionType('run');
    setRunResult(null);
    setActiveRightTab('testcase');

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage // Sends 'javascript', 'c++', or 'java'
      });
      setRunResult(response.data.results || response.data);
    } catch (error) {
      setRunResult({
        status: 'error',
        errorMessage: error.response?.data?.message || 'Execution Error'
      });
    } finally {
      setLoading(false);
      setExecutionType('');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setExecutionType('submit');
    setSubmitResult(null);
    setActiveRightTab('result');

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);

      if (response.data?.status === 'accepted') {
        triggerInlineConfetti();
      }
    } catch (error) {
      setSubmitResult({
        status: 'error',
        errorMessage: error.response?.data?.message || 'Submission failed'
      });
    } finally {
      setLoading(false);
      setExecutionType('');
    }
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUserOutput = (index) => {
    if (!runResult) return null;

    if (runResult.status === 'error') {
      return runResult.errorMessage;
    }

    const res = Array.isArray(runResult)
      ? runResult[index]
      : runResult.results?.[index] || runResult.testResults?.[index];

    if (!res) return "No response data";

    if (res.compile_output) return res.compile_output;
    if (res.stderr) return res.stderr;

    const output = res.stdout ?? res.output ?? res.userOutput ?? res.actualOutput;
    if (output !== undefined && output !== null) {
      return output.trim() === "" ? "(No Output / Blank)" : output;
    }

    return res.status?.description || "Execution Completed";
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b0e14] text-slate-300 font-sans p-3 gap-3 overflow-hidden select-none">
      
      {/* Header Navbar */}
      <nav className="h-12 bg-[#121722] border border-slate-800/80 rounded-2xl px-5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-6">
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
          <NavLink to="/" className="text-xs font-semibold text-slate-300 bg-[#1a2130] border border-slate-700/50 px-3.5 py-1.5 rounded-xl hover:border-indigo-500/50 transition-all">
            Problem Set
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-[#1a2130] border border-slate-700/50 px-3.5 py-1.5 rounded-xl text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-indigo-600/40 border border-indigo-400/60 flex items-center justify-center text-[10px] font-bold text-indigo-200">
              {user?.firstname?.[0] || 'A'}
            </div>
            <span className="font-medium">{user?.firstname || 'User'}</span>
          </div>
        </div>
      </nav>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex gap-3 overflow-hidden">

        {/* Left Side Panel */}
        <div className="w-1/2 flex flex-col bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex bg-[#0d111a] border-b border-slate-800/80 p-2 gap-2">
            {['description', 'editorial', 'solutions', 'submissions', 'ChatAI'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeLeftTab === tab
                    ? 'bg-[#1e2638] text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2130]/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
            {problem && activeLeftTab === 'description' && (
  <>
    {/* Header Section */}
    <div className="flex justify-between items-center bg-gradient-to-r from-[#1a2130] to-[#0d111a] border border-slate-700/40 p-5 rounded-2xl shadow-lg">
      <h1 className="text-xl font-extrabold text-white tracking-tight">
        {problem.title}
      </h1>
      <div className="flex items-center gap-3">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${
            problem.difficulty?.toLowerCase() === "easy"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : problem.difficulty?.toLowerCase() === "medium"
              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
          }`}
        >
          {problem.difficulty || "Easy"}
        </span>
        <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/30">
          {problem.points} pts
        </span>
      </div>
    </div>

    {/* Problem Description */}
    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d111a]/90 p-6 rounded-2xl border border-slate-800/80 shadow-inner mt-4">
      {problem.description}
    </div>

    {/* Examples Section */}
    {problem.visibleTestcases && problem.visibleTestcases.length > 0 && (
      <div className="space-y-4 mt-6">
        <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
          Examples
        </h3>
        {problem.visibleTestcases.map((example, idx) => (
          <div
            key={idx}
            className="bg-[#0d111a] border border-slate-800/80 rounded-2xl p-4 font-mono text-xs space-y-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <span className="text-indigo-400 font-bold">Input:</span>{" "}
              <span className="text-slate-300">{example.input}</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">Output:</span>{" "}
              <span className="text-slate-300">{example.output}</span>
            </div>
            {example.explaination && (
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 italic">
                💡 {example.explaination}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Tags Section */}
    {problem.tags && problem.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/60 mt-6">
        {problem.tags.map((tag, index) => (
          <span
            key={typeof tag === "string" ? tag : index}
            className="text-[11px] font-medium px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
          >
            #{typeof tag === "string" ? tag.trim() : tag}
          </span>
        ))}
      </div>
    )}
  </>
)}


            {activeLeftTab === 'submissions' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submissions History</h3>
                {submissions.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-4 text-center bg-[#0d111a] rounded-2xl border border-slate-800/80">
                    No past submissions found for this problem.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#0d111a]">
                    <table className="w-full text-xs text-left font-mono">
                      <thead className="bg-[#181f2e] text-slate-400 border-b border-slate-800 text-[11px]">
                        <tr>
                          <th className="p-3">Status</th>
                          <th className="p-3">Language</th>
                          <th className="p-3">Runtime</th>
                          <th className="p-3">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {submissions.map((sub) => (
                          <tr 
                            key={sub._id} 
                            onClick={() => setSelectedSubmission(sub)}
                            className="hover:bg-[#181f2e]/60 cursor-pointer transition-colors"
                          >
                            <td className="p-3 font-bold">
                              <span className={sub.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}>
                                {sub.status?.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-slate-300">{sub.language}</td>
                            <td className="p-3 text-slate-400">{sub.runtime ? `${sub.runtime} ms` : 'N/A'}</td>
                            <td className="p-3 text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'solutions' && (
              <div className="space-y-4">
                {problem?.referenceSolution?.map((sol, i) => (
                  <div key={i} className="bg-[#0d111a] border border-slate-800/80 rounded-2xl p-3.5">
                    <div className="text-xs font-bold text-indigo-400 mb-2 uppercase">{sol.language} Solution</div>
                    <pre className="text-xs font-mono p-3 bg-[#080a0f] rounded-xl border border-slate-800/60 text-slate-300 overflow-x-auto">
                      <code>{sol.completeCode}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Note: Ensure these components are imported in your project */}
            {activeLeftTab === 'editorial' && typeof Editorial !== 'undefined' && (
              <Editorial secureurl={problem?.secureurl} thumbnail={problem?.thumbnail} duration={problem?.duration} />
            )}
            {activeLeftTab === 'ChatAI' && typeof ChatAi !== 'undefined' && (
              <ChatAi problem={problem} />
            )}
          </div>
        </div>

        {/* Right Side Editor & Console */}
        <div className="w-1/2 flex flex-col gap-3">
          
          <div className="flex-1 flex flex-col bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 py-2.5 bg-[#0d111a] border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Editor
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#1a2130] text-indigo-200 border border-slate-700/50 text-xs px-3 py-1 rounded-xl outline-none cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={selectedLanguage === 'c++' ? 'cpp' : selectedLanguage}
                value={code}
                theme="vs-dark"
                onChange={(v) => setCode(v || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontFamily: "Fira Code, monospace",
                }}
              />
            </div>
          </div>

          {/* Console Area */}
          <div className={`h-[42%] bg-[#121722] border rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all ${
            loading ? 'border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : 'border-slate-800/80'
          }`}>
            
            <div className="flex justify-between items-center px-3 py-2 bg-[#0d111a] border-b border-slate-800/80">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveRightTab('testcase')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                    activeRightTab === 'testcase' ? 'text-indigo-300 bg-[#1e2638] border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Testcase Results
                </button>
                <button
                  onClick={() => setActiveRightTab('result')}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                    activeRightTab === 'result' ? 'text-indigo-300 bg-[#1e2638] border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Submission Result
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs relative">
              
              {loading && (
                <div className="absolute inset-0 bg-[#0d111a]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
                  <span className="text-xs font-bold text-indigo-300 animate-pulse tracking-wider">
                    {executionType === 'run' ? 'EXECUTING TESTCASES...' : 'EVALUATING SUBMISSION...'}
                  </span>
                </div>
              )}

              {/* TESTCASES TAB */}
              {activeRightTab === 'testcase' && (
                <div>
                  {problem?.visibleTestcases && problem.visibleTestcases.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex gap-2 border-b border-slate-800/80 pb-2">
                        {problem.visibleTestcases.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTestCaseTab(idx)}
                            className={`px-3 py-1 text-[11px] rounded-lg font-medium transition-all ${
                              activeTestCaseTab === idx 
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                                : 'bg-[#181f2e] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {problem.visibleTestcases[activeTestCaseTab] && (
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-500 text-[10px] block mb-1">Input:</span>
                            <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-slate-300">
                              {problem.visibleTestcases[activeTestCaseTab].input}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500 text-[10px] block mb-1">Expected Output:</span>
                            <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-emerald-400">
                              {problem.visibleTestcases[activeTestCaseTab].output}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500 text-[10px] block mb-1">Your Output:</span>
                            <div className="bg-[#080a0f] p-2.5 rounded-xl border border-slate-800/80 text-indigo-300 font-bold">
                              {getUserOutput(activeTestCaseTab) !== null ? (
                                getUserOutput(activeTestCaseTab)
                              ) : (
                                <span className="text-slate-600 italic font-normal">Run code to see output</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic">No visible test cases available for this problem.</div>
                  )}
                </div>
              )}

              {/* SUBMISSION RESULT TAB */}
              {activeRightTab === 'result' && (
                <div>
                  {!submitResult ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#181f2e] border border-slate-800 flex items-center justify-center text-slate-500">
                        ⚡
                      </div>
                      <p className="text-slate-400 font-sans text-xs">Ready for submission evaluation</p>
                      <p className="text-slate-600 font-sans text-[11px]">Click "Submit" below to evaluate your solution against all test cases.</p>
                    </div>
                  ) : submitResult.status === 'accepted' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-emerald-400 font-bold text-sm tracking-wide">Accepted</h4>
                            <p className="text-slate-400 text-[11px]">All test cases passed successfully!</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
                          {submitResult.testCasesPassed || submitResult.testCasesTotal || 'All'} / {submitResult.testCasesTotal || 'All'} Passed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 font-sans">
                        <div className="bg-[#080a0f] border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Runtime</span>
                          <div className="text-base font-bold text-white mt-1">
                            {submitResult.runtime || '12'} <span className="text-xs font-normal text-slate-400">ms</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[85%] rounded-full"></div>
                          </div>
                        </div>

                        <div className="bg-[#080a0f] border border-slate-800/80 p-3 rounded-2xl flex flex-col justify-between">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Memory</span>
                          <div className="text-base font-bold text-white mt-1">
                            {submitResult.memory || '42.1'} <span className="text-xs font-normal text-slate-400">MB</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[70%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 font-bold text-sm">
                            ✕
                          </div>
                          <div>
                            <h4 className="text-rose-400 font-bold text-sm tracking-wide">
                              {submitResult.status?.toUpperCase() || 'WRONG ANSWER'}
                            </h4>
                            <p className="text-slate-400 text-[11px]">Submission failed evaluation.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#080a0f] border border-slate-800/80 p-3.5 rounded-2xl">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Details / Error Log:</span>
                        <p className="text-rose-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                          {submitResult.errorMessage || submitResult.error || 'One or more hidden testcases failed.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="p-3 bg-[#0d111a] border-t border-slate-800/80 flex justify-end items-center gap-3">
              <button
                onClick={handleRun}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#181f2e] border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading && executionType === 'run' ? 'RUNNING...' : 'RUN CODE'}
              </button>
              
              <button
                onClick={handleSubmitCode}
                disabled={loading}
                className="px-6 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading && executionType === 'submit' ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Code Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121722] border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 bg-[#0d111a] border-b border-slate-800/80">
              <span className={`text-xs font-bold ${selectedSubmission.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                SUBMISSION CODE
              </span>
              <button className="text-slate-400 hover:text-white text-sm" onClick={() => setSelectedSubmission(null)}>✕</button>
            </div>
            <div className="p-4 bg-[#080a0f] relative max-h-[60vh] overflow-y-auto font-mono text-xs text-slate-300">
              <button 
                onClick={() => handleCopyCode(selectedSubmission.code)} 
                className="absolute top-3 right-3 text-[10px] bg-indigo-600 px-2.5 py-1 rounded-lg text-white font-sans"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <pre className="pt-4"><code>{selectedSubmission.code}</code></pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProblemPage;

// export default ProblemPage;
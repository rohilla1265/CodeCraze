// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import axiosClient from '../../utils/axiosClient';
// import { FaCopy, FaCheck, FaClock, FaShareAlt } from 'react-icons/fa'; 

// const socket = io('http://localhost:5173'); // Apni backend URL se replace karein

// export default function GamificationTest({ user }) {
//     // States
//     const [viewState, setViewState] = useState('landing');
//     const [problems, setProblems] = useState([]); // Dynamic backend problems store
//     const [roomCode, setRoomCode] = useState(''); // Input box ke liye
//     const [currentRoomId, setCurrentRoomId] = useState(''); // Actual active room code
//     const [isCreator, setIsCreator] = useState(false);
//     const [selectedProblem, setSelectedProblem] = useState(null);
//     const [selectedTimer, setSelectedTimer] = useState('30'); // Default timer 30 mins
//     const [copied, setCopied] = useState(false);
//     const [score, setScore] = useState(100);
//     const [loadingProblems, setLoadingProblems] = useState(false);

//     // 1. Fetch Problems from Backend API on Landing Component Mount
//     useEffect(() => {
//         const fetchProblems = async () => {
//             setLoadingProblems(true);
//             try {
//                 const { data } = await axiosClient.get('/problem/getAllProblem');
//                 setProblems(Array.isArray(data) ? data : data.problems || []);
//             } catch (err) {
//                 console.error("Backend Problems Fetching Failed:", err.message);
//             } finally {
//                 setLoadingProblems(false);
//             }
//         };
//         fetchProblems();
//     }, []);

//     // 2. Socket Listeners
//     useEffect(() => {
//         socket.on('room_created', (data) => {
//             setCurrentRoomId(data.roomId);
//             setIsCreator(true);
//             setViewState('lobby'); // Selection aur copy setup page dikhao
//         });

//         socket.on('room_joined_success', (data) => {
//             setCurrentRoomId(data.roomId);
//             setIsCreator(false);
//             setViewState('lobby');
//         });

//         socket.on('contest_started', (problemData) => {
//             setSelectedProblem(problemData);
//             setViewState('playground');
//         });

//         return () => {
//             socket.off('room_created');
//             socket.off('room_joined_success');
//             socket.off('contest_started');
//         };
//     }, []);

//     // 3. Create Room Handler (Dynamic data integration)
//     const handleCreateCohort = async () => {
//         console.log("Button clicked!");
//         if (!selectedProblem) {
//             alert("Pehle right side ki table se ek problem select karein!");
//             return;
//         }
        
//         try {
//             const res = await axiosClient.post("/rooms/create", {
//                 problemId: selectedProblem._id || selectedProblem.id,
//                 totalMarks: selectedProblem.points || 100,
//                 duration: selectedTimer // Selected duration limit backend ko send ho rahi h
//             });

//             console.log("Axios Raw Response:", res);

//             if (res && res.data && res.data.roomCode) {
//                 const serverRoomCode = res.data.roomCode;
//                 setCurrentRoomId(serverRoomCode);
//                 setIsCreator(true);
                
//                 // Triggering socket connection after successful room allocation
//                 socket.emit('create_room', { roomId: serverRoomCode, problem: selectedProblem });
//                 setViewState('lobby'); 
//             } else {
//                 console.log("Response to aaya par data blank hai.");
//             }

//         } catch (err) {
//             console.error("Catch Block Catch Error:", err.response?.data || err.message);
//         }
//     };

//     // 4. Join Existing Room Handler
//     const handleJoinCohort = async () => {
//         console.log("Join Button Clicked!");
//         if (!roomCode.trim()) return alert("Please enter a valid room code!");
//         try {
//             const res = await axiosClient.post("/rooms/join", {
//                 roomId: roomCode,
//                 rivalName: user?.name || "Peer_User"
//             });

//             console.log("Join Backend Response:", res.data);

//             if (res && res.data) {
//                 socket.emit("rival_join_room", {
//                     roomId: roomCode,
//                     rivalName: user?.name || "Peer_User"
//                 });
//                 setViewState('lobby');
//             }
//         } catch (err) {
//             console.error("Join Error:", err.response?.data || err.message);
//             alert(err.response?.data?.message || "Room join karne me issue aaya.");
//         }
//     };

//     // 5. Start Contest (Launch Trigger)
//     const handleStartContest = () => {
//         if (!selectedProblem) {
//             alert("Pehle ek problem select karein!");
//             return;
//         }
//         socket.emit('start_contest', { roomId: currentRoomId, problem: selectedProblem });
//     };

//     // 6. Clipboard Copy Engine
//     const handleCopyCode = () => {
//         if (!currentRoomId) return;
//         navigator.clipboard.writeText(currentRoomId);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     return (
//         <div className="min-h-screen bg-[#0a0c10] text-slate-300 p-6 lg:p-10 font-sans">

//             {/* STAGE 1: LANDING PAGE (Create / Join Choice) */}
//             {viewState === 'landing' && (
//                 <div className="max-w-5xl mx-auto space-y-8">
//                     <div className="text-center mb-4">
//                         <h2 className="text-3xl font-black text-white tracking-tight">Code Cohort Arena 🎮</h2>
//                         <p className="text-sm text-slate-500 mt-1">Select a task down below and host or join an existing battle lobby.</p>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                         {/* LEFT ACTIONS AREA */}
//                         <div className="lg:col-span-5 bg-[#11141b] border border-slate-800/80 rounded-[2rem] p-8 shadow-2xl space-y-6 flex flex-col justify-between">
//                             <div className="space-y-6">
//                                 {/* Timer Configurations */}
//                                 <div>
//                                     <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
//                                         <FaClock className="inline mr-2 text-indigo-500" /> Match Duration
//                                     </label>
//                                     <select 
//                                         value={selectedTimer}
//                                         onChange={(e) => setSelectedTimer(e.target.value)}
//                                         className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 outline-none px-4 py-3 rounded-xl text-slate-300 text-sm cursor-pointer"
//                                     >
//                                         <option value="15">15 Minutes</option>
//                                         <option value="30">30 Minutes</option>
//                                         <option value="45">45 Minutes</option>
//                                         <option value="60">60 Minutes</option>
//                                     </select>
//                                 </div>

//                                 <button
//                                     onClick={handleCreateCohort}
//                                     disabled={!selectedProblem}
//                                     className={`w-full font-bold py-4 px-4 rounded-xl transition-all shadow-lg text-sm tracking-wide ${
//                                         selectedProblem 
//                                         ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
//                                         : 'bg-slate-800 text-slate-500 cursor-not-allowed'
//                                     }`}
//                                 >
//                                     {selectedProblem ? "Create Cohort (Host Match) 🚀" : "Select Problem from List to Host"}
//                                 </button>
//                             </div>

//                             <div className="relative flex py-2 items-center">
//                                 <div className="flex-grow border-t border-slate-800"></div>
//                                 <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-600">OR JOIN</span>
//                                 <div className="flex-grow border-t border-slate-800"></div>
//                             </div>

//                             <div className="space-y-3">
//                                 <input
//                                     type="text"
//                                     maxLength={6}
//                                     placeholder="Enter 6-Digit Room Code"
//                                     value={roomCode}
//                                     onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//                                     className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 outline-none px-4 py-3.5 rounded-xl text-center font-mono text-xl text-white tracking-[0.2em]"
//                                 />
//                                 <button
//                                     onClick={handleJoinCohort}
//                                     className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-xl transition-all text-sm"
//                                 >
//                                     Join Existing Cohort
//                                 </button>
//                             </div>
//                         </div>

//                         {/* RIGHT DYNAMIC PROBLEMS GRID */}
//                         <div className="lg:col-span-7 bg-[#11141b] border border-slate-800/60 rounded-[2rem] p-6 flex flex-col">
//                             <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">
//                                 Available Tasks Grid ({problems.length})
//                             </h3>
                            
//                             {loadingProblems ? (
//                                 <div className="text-center py-20 text-slate-500 text-sm animate-pulse">Loading core algorithms data...</div>
//                             ) : (
//                                 <div className="space-y-3 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
//                                     {problems.map((prob) => {
//                                         const uniqueId = prob._id || prob.id;
//                                         const isSelected = selectedProblem?._id === uniqueId || selectedProblem?.id === uniqueId;
//                                         return (
//                                             <div
//                                                 key={uniqueId}
//                                                 onClick={() => setSelectedProblem(prob)}
//                                                 className={`p-4 rounded-xl border transition-all cursor-pointer ${
//                                                     isSelected
//                                                     ? 'bg-indigo-600/10 border-indigo-500 text-white'
//                                                     : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700'
//                                                 }`}
//                                             >
//                                                 <div className="flex justify-between items-center">
//                                                     <div>
//                                                         <h4 className="font-bold text-sm text-slate-200">{prob.title || prob.name || "Untitled"}</h4>
//                                                         <span className="text-[10px] text-slate-500 font-mono">{prob.tags || prob.category || "General"}</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-3">
//                                                         <span className="text-[11px] font-medium text-slate-400">{prob.points || 100} pts</span>
//                                                         <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 ${
//                                                             prob.difficulty === 'Easy' ? 'text-emerald-400' : prob.difficulty === 'Hard' ? 'text-rose-400' : 'text-amber-400'
//                                                         }`}>{prob.difficulty || "Medium"}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* STAGE 2: LOBBY PAGE (Room ID display & Active Status) */}
//             {viewState === 'lobby' && (
//                 <div className="max-w-4xl mx-auto space-y-8">
//                     {/* Top Panel: Copyable Box & Info */}
//                     <div className="bg-[#11141b] border border-slate-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 items-center gap-6 shadow-xl">
//                         <div className="md:col-span-7 space-y-1">
//                             <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
//                                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Battle Cohort Room Created
//                             </p>
//                             <h2 className="text-sm text-slate-400">Apne friend ko combat ke liye invite karein code share karke:</h2>
//                         </div>
                        
//                         {/* Click to Copy Box Section */}
//                         <div className="md:col-span-5 flex items-center justify-between bg-slate-950 border border-slate-800 px-5 py-3.5 rounded-xl font-mono text-xl font-black text-emerald-400 tracking-wider shadow-inner">
//                             <span>{currentRoomId || "ERROR..."}</span>
//                             <button 
//                                 onClick={handleCopyCode}
//                                 className={`text-sm transition-colors p-2 rounded-lg hover:bg-slate-900 ${copied ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
//                                 title="Copy Room Code"
//                             >
//                                 {copied ? <FaCheck /> : <FaCopy />}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Combat Setup Details Meta */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="bg-[#11141b] border border-slate-800/70 rounded-3xl p-6 space-y-4">
//                             <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Lobby Parameters</h3>
//                             <div className="space-y-3 font-medium text-sm text-slate-300">
//                                 <div className="flex justify-between border-b border-slate-800/80 pb-2">
//                                     <span className="text-slate-500">Selected Problem:</span>
//                                     <span className="text-white font-bold">{selectedProblem?.title}</span>
//                                 </div>
//                                 <div className="flex justify-between border-b border-slate-800/80 pb-2">
//                                     <span className="text-slate-500">Duration Limit:</span>
//                                     <span className="text-amber-400 font-mono">{selectedTimer} Minutes</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-slate-500">Maximum Budget:</span>
//                                     <span className="text-emerald-400 font-mono">{selectedProblem?.points || 100} XP</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-[#11141b] border border-slate-800/70 rounded-3xl p-6 flex flex-col justify-between min-h-[180px]">
//                             <div>
//                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Gate Status</h3>
//                                 <p className="text-xs text-slate-500">
//                                     {isCreator ? "Dono side ke code connect hote hi niche wala trigger button dabayein." : "Host se match start hone ka wait ho raha hai."}
//                                 </p>
//                             </div>

//                             <div className="mt-6">
//                                 {isCreator ? (
//                                     <button
//                                         onClick={handleStartContest}
//                                         className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm tracking-wide"
//                                     >
//                                         Launch Match 🚀
//                                     </button>
//                                 ) : (
//                                     <div className="text-center py-4 text-xs font-medium text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-xl animate-pulse">
//                                         Waiting for the creator to select the task and launch...
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* STAGE 3: ACTIVE PLAYGROUND */}
//             {viewState === 'playground' && (
//                 <div className="max-w-7xl mx-auto">
//                     <div className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-xl text-center text-emerald-400 font-medium text-sm">
//                         Combat Active! Problem statement loaded: <strong>{selectedProblem?.title}</strong> (Live Score: {score} XP)
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }
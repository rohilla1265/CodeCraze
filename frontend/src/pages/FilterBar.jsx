// import React from 'react';
// import { useNavigate } from 'react-router';
// import { socket } from '../../utils/Socket';
// export default function FilterSidebar({
//     filters,
//     setFilters,
//     handlecreate,
//     showModal,
//     setShowModal,
//     roomDetails,
//     setRoomDetails,
//     creator,
//     joinee,
//     loading,
//     problems,
//     selectedProblem,
//     setSelectedProblem,
//     selectedTime,
//     setSelectedTime,
//     handleFinalCreateRoom,
//     user,
//     showJoinModal,
//     setShowJoinModal,
//     handleJoin,
//     roomIdInput,
//     setRoomIdInput,
//     otpInput,
//     setOtpInput,
//     joinLoading,
//     joinError,
//     handleJoinSubmit,
// }) {
//     const navigate = useNavigate();
//     const handlePlayBattle = () => {
//         const activeRoomId = roomDetails?.roomId || roomDetails?._id;
//         if (activeRoomId) {
//             // 1. Socket ke zaroori event se sabhi ko notify karein
//             socket.emit('startBattle', { roomId: activeRoomId });
            
//             // 2. Apne aap ko bhi navigate kar lein
//             navigate(`/room/${activeRoomId}`);
//         }
//     };
//     return (
//         <aside className="w-full md:w-64 flex-shrink-0">
//             <div className="sticky top-28 space-y-8">
//                 <div className="bg-slate-900 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[2.5rem] border border-slate-800/80 p-8 shadow-2xl shadow-black/10">
//                     <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-9 pl-1">Filters</h3>
//                     <div className="space-y-8">
//                         <FilterGroup label="Platform Status" value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })}>
//                             <option value="all">Everything</option>
//                             <option value="solved">Solved Task</option>
//                         </FilterGroup>
//                         <FilterGroup label="Complexity" value={filters.difficulty} onChange={(v) => setFilters({ ...filters, difficulty: v })}>
//                             <option value="all">All Difficulty</option>
//                             <option value="easy">Easy</option>
//                             <option value="medium">Medium</option>
//                             <option value="hard">Hard</option>
//                         </FilterGroup>
//                         <FilterGroup
//                             label="Core Topic"
//                             value={filters.tags}
//                             onChange={(v) => setFilters({ ...filters, tags: v })}
//                         >
//                             <option value="all">All Topics</option>
//                             <option value="array">Array</option>
//                             <option value="linkedList">Linked List</option>
//                             <option value="graph">Graph</option>
//                             <option value="dp">Dynamic Programming</option>
//                             <option value="string">String</option>
//                             <option value="twoPointers">Two Pointers</option>
//                             <option value="tree">Tree</option>
//                             <option value="matrix">Matrix</option>
//                             <option value="sorting">Sorting</option>
//                         </FilterGroup>
//                     </div>
//                     <div className="mt-8">
//                         <button className="bg-amber-700 font-bold px-4 py-2 rounded text-white" onClick={handlecreate}>
//                             Create Room
//                         </button>

//                         <button
//                             className="bg-green-500 font-bold px-4 py-2 rounded text-white ml-2"
//                             onClick={() => {
//                                 console.log("Join button clicked!");
//                                 handleJoin();
//                             }}
//                         >
//                             Join Room
//                         </button>

//                         {showModal && (
//                             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
//                                 <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-[420px] text-white shadow-2xl">
//                                     {!roomDetails ? (
//                                         <>
//                                             <h2 className="text-xl font-bold mb-4">Create Battle Room</h2>
//                                             <form onSubmit={handleFinalCreateRoom} className="space-y-4">
//                                                 <div>
//                                                     <label className="block text-sm mb-1 text-slate-300">Select Problem:</label>
//                                                     {loading ? (
//                                                         <p className="text-sm text-amber-500">Problems loading...</p>
//                                                     ) : (
//                                                         <select
//                                                             value={selectedProblem}
//                                                             onChange={(e) => setSelectedProblem(e.target.value)}
//                                                             className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
//                                                         >
//                                                             {problems.map((p) => (
//                                                                 <option key={p._id || p.id} value={p._id || p.id}>
//                                                                     {p.title || p.name || "Problem"}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     )}
//                                                 </div>

//                                                 <div>
//                                                     <label className="block text-sm mb-1 text-slate-300">Select Time (Minutes):</label>
//                                                     <select
//                                                         value={selectedTime}
//                                                         onChange={(e) => setSelectedTime(e.target.value)}
//                                                         className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
//                                                     >
//                                                         <option value={15}>15 Mins</option>
//                                                         <option value={30}>30 Mins</option>
//                                                         <option value={45}>45 Mins</option>
//                                                         <option value={60}>60 Mins</option>
//                                                     </select>
//                                                 </div>

//                                                 <div className="flex justify-end gap-2 pt-2">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => { setShowModal(false); setRoomDetails(null); }}
//                                                         className="px-3 py-1.5 bg-gray-700 rounded text-sm hover:bg-gray-600"
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                     <button
//                                                         type="submit"
//                                                         className="px-4 py-1.5 bg-amber-700 rounded text-sm font-bold hover:bg-amber-600"
//                                                     >
//                                                         Confirm & Create
//                                                     </button>
//                                                 </div>
//                                             </form>
//                                         </>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <h2 className="text-xl font-bold text-emerald-400">Room Created Successfully!</h2>

//                                             <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 space-y-2 text-sm">
//                                                 <p><span className="text-slate-400">Room ID / Code:</span> <span className="font-mono font-bold text-indigo-400">{roomDetails.roomId || roomDetails.code || roomDetails._id}</span></p>
//                                                 {roomDetails.otp && (
//                                                     <p><span className="text-slate-400">OTP:</span> <span className="font-mono font-bold text-amber-400">{roomDetails.otp}</span></p>
//                                                 )}
//                                                 <p><span className="text-slate-400">Selected Time:</span> <span className="font-semibold">{selectedTime} Minutes</span></p>
//                                             </div>

//                                             <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
//                                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Players Status</p>
//                                                 <div className="flex items-center justify-between text-sm">
//                                                     <span className="flex items-center gap-2">
//                                                         🟢 <span className="font-medium">{creator?.firstname || user?.firstname} (Host)</span>
//                                                     </span>
//                                                     <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Ready</span>
//                                                 </div>

//                                                 <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
//                                                     {joinee ? (
//                                                         <span className="flex items-center gap-2 text-emerald-300">
//                                                             🟢 <span>{joinee.firstname || "Player Joined"}</span>
//                                                             <span className="text-xs font-mono text-slate-400">ID: {joinee._id || joinee}</span>
//                                                         </span>
//                                                     ) : (
//                                                         <span className="text-slate-500 italic flex items-center gap-2">
//                                                             <span className="animate-pulse">⏳</span> Waiting for player to join...
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <div className="flex justify-end gap-2 pt-2">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => { setShowModal(false); setRoomDetails(null); }}
//                                                     className="px-3 py-1.5 bg-gray-700 rounded text-sm hover:bg-gray-600"
//                                                 >
//                                                     Close
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={handlePlayBattle}
//                                                     className="px-4 py-1.5 bg-indigo-600 rounded text-sm font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
//                                                 >
//                                                     Play Battle 🚀
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                         {showJoinModal && (
//                             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
//                                 <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-[420px] text-white shadow-2xl">
//                                     <h2 className="text-xl font-bold mb-4 text-emerald-400">Join Battle Room</h2>

//                                     {joinError && (
//                                         <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-xs rounded">
//                                             {joinError}
//                                         </div>
//                                     )}

//                                     <form onSubmit={handleJoinSubmit} className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm mb-1 text-slate-300">Room ID:</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 placeholder="Enter Room UUID"
//                                                 value={roomIdInput}
//                                                 onChange={(e) => setRoomIdInput(e.target.value)}
//                                                 className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm mb-1 text-slate-300">Room OTP / Passcode:</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 placeholder="Enter 8-character OTP"
//                                                 value={otpInput}
//                                                 onChange={(e) => setOtpInput(e.target.value)}
//                                                 className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
//                                             />
//                                         </div>

//                                         <div className="flex justify-end gap-2 pt-2">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowJoinModal(false)}
//                                                 className="px-3 py-1.5 bg-gray-700 rounded text-sm hover:bg-gray-600"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 type="submit"
//                                                 disabled={joinLoading}
//                                                 className="px-4 py-1.5 bg-emerald-600 rounded text-sm font-bold hover:bg-emerald-500 disabled:opacity-50"
//                                             >
//                                                 {joinLoading ? 'Joining...' : 'Join Room 🚀'}
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </aside>
//     );
// }

// const FilterGroup = ({ label, value, onChange, children }) => (
//     <div className="flex flex-col gap-2.5">
//         <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1.5">{label}</label>
//         <div className="relative">
//             <select
//                 className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-[13px] font-medium text-slate-300 cursor-pointer appearance-none shadow-inner"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//             >
//                 {children}
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-600 text-xs">
//                 ▼
//             </div>
//         </div>
//     </div>
// );
import React from 'react';
import { useNavigate } from 'react-router';
import { socket } from '../../utils/Socket';
import { PlusCircle, LogIn, Sparkles } from 'lucide-react';

export default function FilterSidebar({
    filters,
    setFilters,
    handlecreate,
    showModal,
    setShowModal,
    roomDetails,
    setRoomDetails,
    creator,
    joinee,
    loading,
    problems,
    selectedProblem,
    setSelectedProblem,
    selectedTime,
    setSelectedTime,
    handleFinalCreateRoom,
    user,
    showJoinModal,
    setShowJoinModal,
    handleJoin,
    roomIdInput,
    setRoomIdInput,
    otpInput,
    setOtpInput,
    joinLoading,
    joinError,
    handleJoinSubmit,
}) {
    const navigate = useNavigate();
    const handlePlayBattle = () => {
        const activeRoomId = roomDetails?.roomId || roomDetails?._id;
        if (!joinee && roomDetails?.participants?.length <= 1) {
            alert("Battle start karne ke liye kam se kam 1 aur player ka hona zaroori hai! ⚔️");
            return;
        }
        if (activeRoomId) {
            socket.emit('startBattle', { roomId: activeRoomId });
            navigate(`/room/${activeRoomId}`);
        }
    };

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
                <div className="bg-slate-900 bg-gradient-to-b from-slate-900 to-slate-950 rounded-[2.5rem] border border-slate-800/80 p-6 shadow-2xl shadow-black/20">
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 pl-1 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> Filters
                    </h3>
                    
                    <div className="space-y-6">
                        <FilterGroup label="Platform Status" value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })}>
                            <option value="all">Everything</option>
                            <option value="solved">Solved Task</option>
                        </FilterGroup>
                        <FilterGroup label="Complexity" value={filters.difficulty} onChange={(v) => setFilters({ ...filters, difficulty: v })}>
                            <option value="all">All Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </FilterGroup>
                        <FilterGroup
                            label="Core Topic"
                            value={filters.tags}
                            onChange={(v) => setFilters({ ...filters, tags: v })}
                        >
                            <option value="all">All Topics</option>
                            <option value="array">Array</option>
                            <option value="linkedList">Linked List</option>
                            <option value="graph">Graph</option>
                            <option value="dp">Dynamic Programming</option>
                            <option value="string">String</option>
                            <option value="twoPointers">Two Pointers</option>
                            <option value="tree">Tree</option>
                            <option value="matrix">Matrix</option>
                            <option value="sorting">Sorting</option>
                        </FilterGroup>
                    </div>

                    {/* Styled Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col gap-3">
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-bold text-xs py-3 px-4 rounded-2xl text-white shadow-lg shadow-amber-600/20 transition-all cursor-pointer" 
                            onClick={handlecreate}
                        >
                            <PlusCircle className="w-4 h-4" /> Create Room ⚔️
                        </button>

                        <button
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs py-3 px-4 rounded-2xl text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                            onClick={() => {
                                console.log("Join button clicked!");
                                handleJoin();
                            }}
                        >
                            <LogIn className="w-4 h-4" /> Join Room 🚀
                        </button>

                        {/* Modals remain functional */}
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-[420px] text-white shadow-2xl">
                                    {!roomDetails ? (
                                        <>
                                            <h2 className="text-xl font-bold mb-4">Create Battle Room</h2>
                                            <form onSubmit={handleFinalCreateRoom} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm mb-1 text-slate-300">Select Problem:</label>
                                                    {loading ? (
                                                        <p className="text-sm text-amber-500">Problems loading...</p>
                                                    ) : (
                                                        <select
                                                            value={selectedProblem}
                                                            onChange={(e) => setSelectedProblem(e.target.value)}
                                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                                                        >
                                                            {problems.map((p) => (
                                                                <option key={p._id || p.id} value={p._id || p.id}>
                                                                    {p.title || p.name || "Problem"}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm mb-1 text-slate-300">Select Time (Minutes):</label>
                                                    <select
                                                        value={selectedTime}
                                                        onChange={(e) => setSelectedTime(e.target.value)}
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                                                    >
                                                        <option value={15}>15 Mins</option>
                                                        <option value={30}>30 Mins</option>
                                                        <option value={45}>45 Mins</option>
                                                        <option value={60}>60 Mins</option>
                                                    </select>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowModal(false); setRoomDetails(null); }}
                                                        className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-5 py-2 bg-amber-600 rounded-xl text-xs font-bold hover:bg-amber-500 shadow-md"
                                                    >
                                                        Confirm & Create
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-bold text-emerald-400">Room Created Successfully!</h2>

                                            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2 text-sm">
                                                <p><span className="text-slate-400">Room ID / Code:</span> <span className="font-mono font-bold text-indigo-400">{roomDetails.roomId || roomDetails.code || roomDetails._id}</span></p>
                                                {roomDetails.otp && (
                                                    <p><span className="text-slate-400">OTP:</span> <span className="font-mono font-bold text-amber-400">{roomDetails.otp}</span></p>
                                                )}
                                                <p><span className="text-slate-400">Selected Time:</span> <span className="font-semibold">{selectedTime} Minutes</span></p>
                                            </div>

                                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Players Status</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        🟢 <span className="font-medium">{creator?.firstname || user?.firstname} (Host)</span>
                                                    </span>
                                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">Ready</span>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                                                    {joinee ? (
                                                        <span className="flex items-center gap-2 text-emerald-300">
                                                            🟢 <span>{joinee.firstname || "Player Joined"}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 italic flex items-center gap-2">
                                                            <span className="animate-pulse">⏳</span> Waiting for player...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowModal(false); setRoomDetails(null); }}
                                                    className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-700"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handlePlayBattle}
                                                    className="px-5 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
                                                >
                                                    Play Battle 🚀
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {showJoinModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-[420px] text-white shadow-2xl">
                                    <h2 className="text-xl font-bold mb-4 text-emerald-400">Join Battle Room</h2>

                                    {joinError && (
                                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-xs rounded-xl">
                                            {joinError}
                                        </div>
                                    )}

                                    <form onSubmit={handleJoinSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm mb-1 text-slate-300">Room ID:</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter Room UUID"
                                                value={roomIdInput}
                                                onChange={(e) => setRoomIdInput(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm mb-1 text-slate-300">Room OTP / Passcode:</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter 8-character OTP"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowJoinModal(false)}
                                                className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={joinLoading}
                                                className="px-5 py-2 bg-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-500 disabled:opacity-50 shadow-md"
                                            >
                                                {joinLoading ? 'Joining...' : 'Join Room 🚀'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}

const FilterGroup = ({ label, value, onChange, children }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1.5">{label}</label>
        <div className="relative">
            <select
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-indigo-500/50 text-[13px] font-medium text-slate-300 cursor-pointer appearance-none shadow-inner"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-600 text-xs">
                ▼
            </div>
        </div>
    </div>
);
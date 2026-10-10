import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../../utils/axiosClient';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from "../../authSlice.js";
import { socket } from '../../utils/Socket.jsx'; 
import Navbar from './Navbar';
import FilterSidebar from './FilterBar.jsx';

function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedTime, setSelectedTime] = useState(60);
  const [loading, setLoading] = useState(false);
  
  const [roomInfo, setRoomInfo] = useState(null);
  const [creator, setCreator] = useState(null);
  const [joinee, setJoinee] = useState(null);

  const [roomIdInput, setRoomIdInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tags: 'all',
    status: 'all'
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Socket Listeners for Room Updates
  useEffect(() => {
    if (!roomInfo?.roomId) return;

    socket.emit('joinRoom', { roomId: roomInfo.roomId });

    socket.on('userJoined', (data) => {
      if (data.room) {
        setCreator(data.room.creator);
        setJoinee(data.room.joinee);
        setRoomInfo(data.room);
      }
    });

    // 🟢 Yeh raha event jo baaki members ko bhi auto-navigate kar dega
    socket.on('battleStarted', (data) => {
      const activeRoomId = data.room?.roomId || data.roomId || roomInfo.roomId;
      navigate(`/room/${activeRoomId}`); 
    });

    return () => {
      socket.off('userJoined');
      socket.off('battleStarted');
    };
  }, [roomInfo?.roomId, navigate]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) { console.error(error); }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) { console.error(error); }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handlecreate = async () => {
    setShowModal(true);
    try {
      setLoading(true);
      const res = await axiosClient.get("/problem/getAllProblem");
      const data = res.data.problems || res.data || [];
      setProblems(data);
      if (data.length > 0) {
        setSelectedProblem(data[0]._id || data[0].id);
      }
    } catch (err) {
      console.error("Problems fetch nahi ho paye:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setJoinError('');
    setJoinLoading(true);

    try {
      const response = await axiosClient.post('/room/join', {
        roomId: roomIdInput.trim(),
        otp: otpInput.trim(),
        userId: user?._id || user?.id
      });

      if (response.data) {
        const joinedRoom = response.data.room || response.data;
        setRoomInfo(joinedRoom);
        setCreator(joinedRoom.creator);
        setJoinee(joinedRoom.joinee);
        setSelectedTime(joinedRoom.durationMinutes || 60);
        setShowJoinModal(false);
        setShowModal(true);
      }
    } catch (err) {
      setJoinError(err.response?.data?.error || err.message || 'Failed to join room');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleJoin = () => {
    setShowJoinModal(true);
  };

  const handleFinalCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        problemId: selectedProblem,
        durationMinutes: Number(selectedTime),
      };

      const res = await axiosClient.post("/room/create", payload);
      if (res.data.success) {
        const createdRoom = res.data.room || res.data;
        setRoomInfo(createdRoom);
        setCreator(createdRoom.creator);
        setJoinee(createdRoom.joinee);

        // 🟢 YAHAN YE LINE ADD KAREIN: Creator ko socket room join karwayein
        socket.emit('joinRoom', { roomId: createdRoom.roomId });
      }
    } catch (err) {
      console.error("Room creation error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' ||
      problem.difficulty?.toLowerCase() === filters.difficulty.toLowerCase();
    const tagMatch = filters.tags === 'all' ||
      (Array.isArray(problem.tags) ? problem.tags.some(t => t.toLowerCase() === filters.tags.toLowerCase()) : problem.tags?.toLowerCase() === filters.tags.toLowerCase());
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all' || (filters.status === 'solved' && isSolved);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <Navbar
        user={user}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        dropdownRef={dropdownRef}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto p-6 lg:p-12 flex flex-col md:flex-row gap-12">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          handlecreate={handlecreate}
          showModal={showModal}
          setShowModal={setShowModal}
          roomDetails={roomInfo}
          setRoomDetails={setRoomInfo}
          creator={creator}
          joinee={joinee}
          loading={loading}
          problems={problems}
          selectedProblem={selectedProblem}
          setSelectedProblem={setSelectedProblem}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          handleFinalCreateRoom={handleFinalCreateRoom}
          user={user}
          showJoinModal={showJoinModal}
          setShowJoinModal={setShowJoinModal}
          handleJoin={handleJoin}
          roomIdInput={roomIdInput}
          setRoomIdInput={setRoomIdInput}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          joinLoading={joinLoading}
          joinError={joinError}
          handleJoinSubmit={handleJoinSubmit}
        />

        <div className="flex-grow">
          <div className="mb-12 pl-1">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2.5">Problem Set</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">Solve challenges, earn points, and master coding interview patterns.</p>
          </div>

          <div className="space-y-3.5">
            <AnimatePresence mode='popLayout'>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.3 }}
                    key={problem._id}
                    className="group bg-slate-900 border border-slate-800/70 hover:border-indigo-500/30 rounded-2xl p-6 flex items-center justify-between hover:bg-slate-800/50 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-2 h-10 rounded-full ${solvedProblems.some(sp => sp._id === problem._id) ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-700'}`} />
                      <div>
                        <NavLink to={`/problem/${problem._id}`} className="text-lg font-extrabold text-slate-100 group-hover:text-indigo-300 transition-colors leading-tight">
                          {problem.title}
                        </NavLink>
                        <div className="flex gap-5 mt-1.5 items-center">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyTextColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {problem.tags.main ? null : problem.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-[11px] text-slate-500 font-mono font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="h-12 w-12 flex-shrink-0 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 group-hover:rotate-[-10deg] group-hover:scale-110 active:scale-95"
                    >
                      <span className="text-white text-xl font-light transform group-hover:translate-x-0.5 transition-transform">→</span>
                    </NavLink>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24 text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30"
                >
                  <p className="text-6xl mb-5 opacity-40">🔍</p>
                  <p className="font-semibold text-lg">No matches found for current filters.</p>
                  <p className="text-sm mt-1">Try adjusting status, complexity, or topic.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

const getDifficultyTextColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'text-emerald-300';
    case 'medium': return 'text-amber-300';
    case 'hard': return 'text-rose-300';
    default: return 'text-slate-400';
  }
};

const getDifficultyBgColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-emerald-500/10';
    case 'medium': return 'bg-amber-500/10';
    case 'hard': return 'bg-rose-500/10';
    default: return 'bg-slate-800';
  }
};

export default Home;
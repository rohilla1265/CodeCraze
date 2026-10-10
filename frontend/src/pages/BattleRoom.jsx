import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { Code2 } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { socket } from '../../utils/Socket';

const BattleRoom = () => {
  const { user } = useSelector((state) => state.auth);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [executionType, setExecutionType] = useState('');

  const [activeRightTab, setActiveRightTab] = useState('testcase');
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  
  // Battle Specific States
  const [timeLeft, setTimeLeft] = useState(0);
  const [winner, setWinner] = useState(null);
  const timerRef = useRef(null);

  const triggerInlineConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.85, x: 0.88 },
      colors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899']
    });
  };

  const getInitialCodeForLanguage = (problemData, lang) => {
    if (!problemData?.startCode || !Array.isArray(problemData.startCode)) return '';
    const currentLang = lang.toLowerCase().trim();
    const match = problemData.startCode.find((sc) => {
      const apiLang = sc.language?.toLowerCase().trim();
      if ((currentLang === 'javascript' || currentLang === 'js') && (apiLang === 'js' || apiLang === 'javascript')) return true;
      if ((currentLang === 'c++' || currentLang === 'cpp') && (apiLang === 'c++' || apiLang === 'cpp')) return true;
      return apiLang === currentLang;
    });
    return match ? (match.initialCode || match.completeCode || match.code || '') : '';
  };

  // 1. Fetch Room Details & Populated Problem
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const roomRes = await axiosClient.get(`/room/${roomId}`);
        if (roomRes.data.success && roomRes.data.room) {
          const room = roomRes.data.room;
          setRoomData(room);
          
          if (room.problemId && typeof room.problemId === 'object') {
            setProblem(room.problemId);
            setCode(getInitialCodeForLanguage(room.problemId, selectedLanguage));
          }

          const durationSecs = (room.durationMinutes || 60) * 60;
          setTimeLeft(durationSecs);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
    socket.emit('joinRoom', { roomId });

    socket.on('userLeft', (data) => {
      setRoomData(data.room);
      if (user?._id) {
        setWinner(user._id);
      }
    });

    socket.on('battleResult', (data) => {
      if (data.winner?.userId) {
        setWinner(data.winner.userId);
      }
    });

    // 🔔 Yeh naya socket listener add karein yahan:
    socket.on('battleOver', (data) => {
      if (data?.winnerId) {
        setWinner(data.winnerId);
        triggerInlineConfetti();
      }
    });

    return () => {
      socket.off('userLeft');
      socket.off('battleResult');
      socket.off('battleOver'); 
    };
  }, [roomId, user?._id]);

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (problem) {
      setCode(getInitialCodeForLanguage(problem, selectedLanguage));
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    if (!problem?._id) return;
    setLoading(true);
    setExecutionType('run');
    setRunResult(null);
    setActiveRightTab('testcase');

    try {
      const response = await axiosClient.post(`/submission/run/${problem._id}`, {
        code,
        language: selectedLanguage
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
    if (!problem?._id) return;
    setLoading(true);
    setExecutionType('submit');
    setSubmitResult(null);
    setActiveRightTab('result');

    try {
      const probId = problem._id;
      // Seedha battle evaluation API call karo bina normal submit ke
      const response = await axiosClient.post('/battle/evaluate', {
        roomId,
        problemId: probId,
        userId: user?._id,
        code,
        language: selectedLanguage
      });
      
      setSubmitResult(response.data);

      // Agar winner true hai toh confetti aur win state trigger karo
      if (response.data?.winner) {
        triggerInlineConfetti();
        setWinner(user?._id);
      }
    } catch (error) {
      setSubmitResult({
        status: 'error',
        errorMessage: error.response?.data?.message || 'Evaluation failed'
      });
    } finally {
      setLoading(false);
      setExecutionType('');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await axiosClient.post('/room/leave', { roomId, userId: user?._id });
      navigate('/');
    } catch (err) {
      console.error("Leave error:", err);
    }
  };

  const getUserOutput = (index) => {
    if (!runResult) return null;
    if (runResult.status === 'error') return runResult.errorMessage;
    const res = Array.isArray(runResult) ? runResult[index] : (runResult.results?.[index] || runResult.testResults?.[index]);
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
          <div className="flex items-center gap-3 text-xl font-extrabold text-white">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Battle Arena ⚔️</span>
          </div>
        </div>

        <div className="bg-[#1a2130] border border-slate-700/50 px-4 py-1 rounded-xl text-amber-400 font-mono text-sm font-bold shadow-inner">
          ⏳ {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveRoom}
            className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
          >
            Leave Room 🚪
          </button>
        </div>
      </nav>

      {/* Winner Overlay */}
      {winner ? (
        <div className="flex-grow flex items-center justify-center bg-[#0b0e14]">
          <div className="bg-[#121722] border border-slate-800 p-8 rounded-2xl text-center space-y-4 shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-black text-emerald-400">🏆 Battle Finished!</h2>
            <p className="text-sm text-slate-300">
              {winner === user?._id ? "Aap Jeet Gaye! 🎉 (+10 Points)" : "Opponent Won , Better luck next Time 😢"}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 px-6 py-2 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-lg cursor-pointer"
            >
              Back to Home 🏠
            </button>
          </div>
        </div>
      ) : (
        /* Workspace Layout */
        <div className="flex-1 flex gap-3 overflow-hidden">
          
          {/* Left Panel: Problem Description */}
          <div className="w-1/2 flex flex-col bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl p-5 overflow-y-auto space-y-5">
            {problem ? (
              <>
                <div className="flex justify-between items-center bg-gradient-to-r from-[#1a2130] to-[#0d111a] border border-slate-700/40 p-4 rounded-2xl shadow-lg">
                  <h1 className="text-xl font-extrabold text-white">{problem.title}</h1>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full border uppercase bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    {problem.difficulty || 'Easy'}
                  </span>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d111a]/90 p-6 rounded-2xl border border-slate-800/80 shadow-inner">
                  {problem.description}
                </div>

                {problem.visibleTestcases && problem.visibleTestcases.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Examples</h3>
                    {problem.visibleTestcases.map((example, idx) => (
                      <div key={idx} className="bg-[#0d111a] border border-slate-800/80 rounded-2xl p-4 font-mono text-xs space-y-2 shadow-md">
                        <div><span className="text-indigo-400 font-bold">Input:</span> <span className="text-slate-300">{example.input}</span></div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> <span className="text-slate-300">{example.output}</span></div>
                        {example.explaination && (
                          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 italic">
                            💡 {example.explaination}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 italic">Loading problem details...</div>
            )}
          </div>

          {/* Right Panel: Editor & Console */}
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
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
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
            <div className="h-[42%] bg-[#121722] border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
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

                {activeRightTab === 'testcase' && problem?.visibleTestcases && (
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
                )}

                {activeRightTab === 'result' && (
                  <div>
                    {!submitResult ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#181f2e] border border-slate-800 flex items-center justify-center text-slate-500">⚡</div>
                        <p className="text-slate-400 font-sans text-xs">Ready for submission evaluation</p>
                      </div>
                    ) : submitResult.status === 'accepted' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">✓</div>
                            <div>
                              <h4 className="text-emerald-400 font-bold text-sm">Accepted</h4>
                              <p className="text-slate-400 text-[11px]">All test cases passed successfully!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40">
                          <h4 className="text-rose-400 font-bold text-sm">{submitResult.status?.toUpperCase() || 'WRONG ANSWER'}</h4>
                        </div>
                        <div className="bg-[#080a0f] border border-slate-800/80 p-3.5 rounded-2xl">
                          <p className="text-rose-300 font-mono text-xs whitespace-pre-wrap">{submitResult.errorMessage || 'Testcase failed.'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-[#0d111a] border-t border-slate-800/80 flex justify-end items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#181f2e] border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-all cursor-pointer"
                >
                  RUN CODE
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={loading}
                  className="px-6 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  SUBMIT
                </button>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default BattleRoom;
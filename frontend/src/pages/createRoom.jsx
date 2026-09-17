// import React, { useState, useEffect } from "react";
// import axiosClient from "./axiosClient"; // Path apne hisab se check kar lena
// import { FaCopy, FaCheck, FaClock, FaBookOpen } from "react-icons/fa";

// export default function CohortDashboard() {
//   const [problems, setProblems] = useState([]);
//   const [roomCode, setRoomCode] = useState(""); // Shuru me empty rahega
//   const [copied, setCopied] = useState(false);
//   const [selectedTimer, setSelectedTimer] = useState("30");
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 1. Fetch all problems from Backend API on mount
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/getAllProblem');
//         // Backend payload array direct hai ya data.problems me hai check karke set karein
//         setProblems(Array.isArray(data) ? data : data.problems || []);
//       } catch (err) {
//         console.error("Problems Fetching Failed:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, []);

//   // 2. Trigger Cohort room creation on backend
//   const handleCreateCohort = async () => {
//     if (!selectedProblem) return alert("Pehle koi problem select karein!");
    
//     try {
//       const res = await axiosClient.post("/rooms/create", {
//         problemId: selectedProblem._id || selectedProblem.id, // MongoDB ID schema handle karne ke liye
//         totalMarks: selectedProblem.points || 100,
//         duration: selectedTimer
//       });

//       if (res.data && res.data.roomCode) {
//         setRoomCode(res.data.roomCode);
//         console.log("Room Created Successfully:", res.data.roomCode);
//       }
//     } catch (err) {
//       console.error("Cohort Creation Error:", err.response?.data || err.message);
//     }
//   };

//   const handleCopyCode = () => {
//     if (!roomCode) return;
//     navigator.clipboard.writeText(roomCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div style={{ display: "flex", gap: "24px", padding: "24px", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      
//       {/* ================= LEFT CONTROLS PANEL ================= */}
//       <div style={{ flex: "1", maxWidth: "320px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", height: "fit-content" }}>
        
//         {/* Timer Setup */}
//         <div style={{ marginBottom: "20px" }}>
//           <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#495057", fontSize: "14px" }}>
//             <FaClock style={{ marginRight: "6px" }} /> Select Duration
//           </label>
//           <select 
//             value={selectedTimer} 
//             onChange={(e) => setSelectedTimer(e.target.value)}
//             style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ced4da", backgroundColor: "#fff", fontSize: "14px" }}
//           >
//             <option value="15">15 Minutes</option>
//             <option value="30">30 Minutes</option>
//             <option value="45">45 Minutes</option>
//             <option value="60">60 Minutes</option>
//           </select>
//         </div>

//         {/* Action Button */}
//         <button 
//           onClick={handleCreateCohort}
//           disabled={!selectedProblem}
//           style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", backgroundColor: selectedProblem ? "#1a73e8" : "#868e96", color: "#fff", fontWeight: "600", cursor: selectedProblem ? "pointer" : "not-allowed", transition: "0.2s", marginBottom: "20px" }}
//         >
//           Create Room & Cohort
//         </button>

//         {/* Dynamic Code Display Box */}
//         {roomCode && (
//           <div>
//             <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}>Generated Room Code:</h3>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#e8f0fe", border: "1px solid #b8d2fb", padding: "12px", borderRadius: "8px" }}>
//               <span style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: "bold", color: "#1a73e8", letterSpacing: "1px" }}>
//                 {roomCode}
//               </span>
//               <button 
//                 onClick={handleCopyCode}
//                 style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#2b8a3e" : "#1a73e8", display: "flex", alignItems: "center", fontSize: "16px" }}
//               >
//                 {copied ? <FaCheck /> : <FaCopy />}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= RIGHT PROBLEMS LIST MATRIX ================= */}
//       <div style={{ flex: "3", backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
//         <h2 style={{ margin: "0 0 4px 0", color: "#212529", fontSize: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaBookOpen style={{ color: "#1a73e8" }} /> Available Problems
//         </h2>
//         <p style={{ margin: "0 0 20px 0", color: "#6c757d", fontSize: "14px" }}>Click on any problem to select it before initializing your active room.</p>

//         {loading ? (
//           <div style={{ textAlign: "center", padding: "4px", color: "#6c757d" }}>Problems Fetch ho rhi hain...</div>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//             <thead>
//               <tr style={{ borderBottom: "2px solid #dee2e6", color: "#495057", fontSize: "14px" }}>
//                 <th style={{ padding: "12px 8px" }}>Select</th>
//                 <th style={{ padding: "12px 8px" }}>Problem Name</th>
//                 <th style={{ padding: "12px 8px" }}>Difficulty</th>
//                 <th style={{ padding: "12px 8px" }}>Points</th>
//               </tr>
//             </thead>
//             <tbody>
//               {problems.map((prob) => {
//                 const currentId = prob._id || prob.id;
//                 const isCurrent = selectedProblem?.id === currentId || selectedProblem?._id === currentId;
//                 return (
//                   <tr 
//                     key={currentId}
//                     onClick={() => setSelectedProblem(prob)}
//                     style={{ borderBottom: "1px solid #edeef0", cursor: "pointer", backgroundColor: isCurrent ? "#e8f0fe" : "transparent" }}
//                   >
//                     <td style={{ padding: "16px 8px" }}>
//                       <input 
//                         type="radio" 
//                         checked={isCurrent} 
//                         onChange={() => setSelectedProblem(prob)}
//                         style={{ cursor: "pointer" }}
//                       />
//                     </td>
//                     <td style={{ padding: "16px 8px" }}>
//                       <div style={{ fontWeight: "600", color: "#212529" }}>{prob.title || prob.name || "Untitled Problem"}</div>
//                       <div style={{ fontSize: "12px", color: "#868e96", marginTop: "2px" }}>{prob.tags || prob.category || "General"}</div>
//                     </td>
//                     <td style={{ padding: "16px 8px" }}>
//                       <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600", backgroundColor: prob.difficulty === "Easy" ? "#e6fcf5" : prob.difficulty === "Hard" ? "#fff0f6" : "#fff9db", color: prob.difficulty === "Easy" ? "#0ca678" : prob.difficulty === "Hard" ? "#e03131" : "#f59f00" }}>
//                         {prob.difficulty || "Medium"}
//                       </span>
//                     </td>
//                     <td style={{ padding: "16px 8px", fontWeight: "500", color: "#495057" }}>{prob.points || 100} pts</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//     </div>
//   );
// }
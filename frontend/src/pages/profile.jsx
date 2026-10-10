// import React, { useState, useEffect } from "react";
// import axiosClient from "../../utils/axiosClient";
// import { 
//   User as UserIcon, Shield, Trash2, Edit3, CheckCircle, 
//   BookOpen, Code2, AlertTriangle, Lock, UserCheck 
// } from "lucide-react";

// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({ solvedCount: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({ firstname: "", lastname: "", age: "" });
//   const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await axiosClient.get(`./api/profile`);
//       if (res.data.success) {
//         setProfile(res.data.user);
//         setStats(res.data.stats || { solvedCount: 0 });
//         setFormData({
//           firstname: res.data.user.firstname || "",
//           lastname: res.data.user.lastname || "",
//           age: res.data.user.age || "",
//         });
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       const res = await axiosClient.put(`/api/profile`, formData);
//       if (res.data.success) {
//         setProfile(res.data.user);
//         setEditMode(false);
//         setSuccessMsg("Profile updated successfully!");
//         setTimeout(() => setSuccessMsg(""), 3000);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update profile");
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       const res = await axiosClient.put(`/api/profile/change-password`, passwordData);
//       if (res.data.success) {
//         setPasswordData({ oldPassword: "", newPassword: "" });
//         setSuccessMsg("Password updated successfully!");
//         setTimeout(() => setSuccessMsg(""), 3000);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to change password");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       setError("");
//       const res = await axiosClient.delete(`/api/delete-account`);
//       if (res.data.success) {
//         window.location.href = "/login";
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete account");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* Status Alerts */}
//         {error && (
//           <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
//             <AlertTriangle className="h-5 w-5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}
//         {successMsg && (
//           <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
//             <CheckCircle className="h-5 w-5 flex-shrink-0" />
//             <span>{successMsg}</span>
//           </div>
//         )}

//         {/* Profile Card */}
//         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//             <div className="flex items-center gap-5">
//               <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20">
//                 {profile?.firstname ? profile.firstname[0].toUpperCase() : "U"}
//               </div>
//               <div>
//                 <div className="flex items-center gap-3">
//                   <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//                     {profile?.firstname} {profile?.lastname || ""}
//                   </h1>
//                   <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full uppercase font-semibold">
//                     {profile?.role || "user"}
//                   </span>
//                 </div>
//                 <p className="text-slate-400 text-sm mt-1">{profile?.email}</p>
//                 {profile?.age && (
//                   <p className="text-slate-500 text-xs mt-1">Age: {profile.age} years</p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setEditMode(!editMode)}
//               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition-all font-medium text-sm"
//             >
//               <Edit3 className="h-4 w-4" />
//               {editMode ? "Cancel Editing" : "Edit Profile"}
//             </button>
//           </div>
//         </div>

//         {/* Edit Form */}
//         {editMode && (
//           <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6">
//             <h2 className="text-lg font-semibold text-slate-200 mb-4">Update Profile Information</h2>
//             <form onSubmit={handleUpdateProfile} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-400 mb-1">First Name *</label>
//                   <input
//                     type="text"
//                     value={formData.firstname}
//                     onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     value={formData.lastname}
//                     onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
//                 <input
//                   type="number"
//                   min="10"
//                   max="70"
//                   value={formData.age}
//                   onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
//             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
//               <Code2 className="h-8 w-8" />
//             </div>
//             <div>
//               <p className="text-slate-400 text-sm font-medium">Problems Solved</p>
//               <p className="text-3xl font-extrabold text-slate-100 mt-1">{stats.solvedCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Problems Solved List */}
//         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//           <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
//             <BookOpen className="h-5 w-5 text-blue-400" /> Solved Problems
//           </h2>
//           {profile?.problemsolved && profile.problemsolved.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {profile.problemsolved.map((prob) => (
//                 <div key={prob._id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
//                   <div>
//                     <p className="font-semibold text-slate-200">{prob.title}</p>
//                     <div className="flex gap-2 mt-2">
//                       {prob.tags?.map((tag, idx) => (
//                         <span key={idx} className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-md">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
//                     prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
//                     prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
//                     "bg-rose-500/10 text-rose-400 border border-rose-500/20"
//                   }`}>
//                     {prob.difficulty || "Unrated"}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-slate-500 text-sm italic">No problems solved yet. Start coding!</p>
//           )}
//         </div>

//         {/* Security & Danger Zone */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
//             <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
//               <Shield className="h-5 w-5 text-indigo-400" /> Security
//             </h2>
//             <form onSubmit={handleChangePassword} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
//                 <input
//                   type="password"
//                   value={passwordData.oldPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
//                 <input
//                   type="password"
//                   value={passwordData.newPassword}
//                   onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
//               >
//                 <Lock className="h-4 w-4" /> Change Password
//               </button>
//             </form>
//           </div>

//           <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-6 flex flex-col justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-rose-400 mb-2 flex items-center gap-2">
//                 <Trash2 className="h-5 w-5" /> Danger Zone
//               </h2>
//               <p className="text-slate-400 text-sm mb-4">
//                 Deleting your account will permanently erase your profile and records from the system.
//               </p>
//             </div>

//             {!showDeleteConfirm ? (
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-600/30 font-medium py-2.5 rounded-xl transition-all text-sm w-full"
//               >
//                 Delete Account
//               </button>
//             ) : (
//               <div className="space-y-3 bg-rose-900/30 p-4 rounded-xl border border-rose-800/40">
//                 <p className="text-xs text-rose-300 font-semibold">Are you sure?</p>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDeleteAccount}
//                     className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 rounded-lg transition-all"
//                   >
//                     Confirm Delete
//                   </button>
//                   <button
//                     onClick={() => setShowDeleteConfirm(false)}
//                     className="flex-1 bg-slate-800 text-slate-300 text-xs font-medium py-2 rounded-lg hover:bg-slate-700 transition-all"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { 
  User as UserIcon, Shield, Trash2, Edit3, CheckCircle, 
  BookOpen, Code2, AlertTriangle, Lock, Award, ExternalLink 
} from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ solvedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [points, setPoints] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ 
    firstname: "", 
    lastname: "", 
    age: "", 
    bio: "", 
    linkedIn: "", 
    Twitter: "" 
  });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosClient.get(`/api/profile`);
      if (res.data.success) {
        setProfile(res.data.user);
        setStats(res.data.stats || { solvedCount: 0 });
        setPoints(res.data.user.points || 0);
        setFormData({
          firstname: res.data.user.firstname || "",
          lastname: res.data.user.lastname || "",
          age: res.data.user.age || "",
          bio: res.data.user.bio || "",
          linkedIn: res.data.user.linkedIn || "",
          Twitter: res.data.user.Twitter || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axiosClient.put(`/api/profile`, formData);
      if (res.data.success) {
        setProfile(res.data.user);
        setEditMode(false);
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axiosClient.put(`/api/profile/change-password`, passwordData);
      if (res.data.success) {
        setPasswordData({ oldPassword: "", newPassword: "" });
        setSuccessMsg("Password updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError("");
      const res = await axiosClient.delete(`/api/delete-account`);
      if (res.data.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Status Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 flex items-center justify-center text-4xl font-black shadow-lg shadow-indigo-500/25 text-white flex-shrink-0 border border-white/10">
                {profile?.firstname ? profile.firstname[0].toUpperCase() : "U"}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    {profile?.firstname} {profile?.lastname || ""}
                  </h1>
                  <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                    {profile?.role || "user"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium">{profile?.email}</p>
                {profile?.age && (
                  <p className="text-slate-500 text-xs font-medium">Age: {profile.age} years</p>
                )}
                
                {/* Bio */}
                <p className="text-slate-300 text-sm mt-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60 max-w-lg leading-relaxed">
                  {profile?.bio || "No bio added yet. Click edit profile to add your bio!"}
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  {profile?.linkedIn && (
                    <a 
                      href={profile.linkedIn.startsWith('http') ? profile.linkedIn : `https://${profile.linkedIn}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3.5 py-2 rounded-xl border border-indigo-500/20 transition-all hover:bg-indigo-500/20"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                  {profile?.Twitter && (
                    <a 
                      href={profile.Twitter.startsWith('http') ? profile.Twitter : `https://${profile.Twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3.5 py-2 rounded-xl border border-sky-500/20 transition-all hover:bg-sky-500/20"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-2xl border border-slate-700/80 transition-all font-semibold text-sm shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <Edit3 className="h-4 w-4 text-indigo-400" />
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Edit Form Drawer / Card */}
        {editMode && (
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2.5">
              <Edit3 className="h-5 w-5 text-indigo-400" /> Update Profile Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Age</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">LinkedIn Profile</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Twitter Profile</label>
                  <input
                    type="text"
                    placeholder="https://twitter.com/username"
                    value={formData.Twitter}
                    onChange={(e) => setFormData({ ...formData, Twitter: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bio</label>
                <textarea
                  rows="3"
                  placeholder="Write a short bio about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3 rounded-2xl transition-all text-sm shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 flex items-center gap-5 shadow-xl backdrop-blur-xl">
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
              <Code2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Problems Solved</p>
              <p className="text-3xl font-black text-slate-100 mt-1">{stats.solvedCount}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 flex items-center gap-5 shadow-xl backdrop-blur-xl">
            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Points</p>
              <p className="text-3xl font-black text-slate-100 mt-1">{points}</p>
            </div>
          </div>
        </div>

        {/* Problems Solved List */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-indigo-400" /> Solved Problems
          </h2>
          {profile?.problemsolved && profile.problemsolved.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.problemsolved.map((prob) => (
                <div key={prob._id} className="bg-slate-950/70 border border-slate-800/70 p-4.5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-2">
                    <p className="font-bold text-slate-200 text-sm">{prob.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prob.tags?.map((tag, idx) => (
                        <span key={idx} className="bg-slate-800/60 text-slate-400 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                    prob.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    prob.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {prob.difficulty || "Unrated"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm font-medium italic py-6 text-center">No problems solved yet. Start coding!</p>
          )}
        </div>

        {/* Security & Danger Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-indigo-400" /> Security
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 mt-2"
              >
                <Lock className="h-4 w-4" /> Change Password
              </button>
            </form>
          </div>

          <div className="bg-rose-950/10 border border-rose-900/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-rose-400 mb-2.5 flex items-center gap-2.5">
                <Trash2 className="h-5 w-5" /> Danger Zone
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Deleting your account will permanently erase your profile and records from the system. This action cannot be undone.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-600/30 font-bold py-3 rounded-2xl transition-all text-sm w-full active:scale-95"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3 bg-rose-950/40 p-4 rounded-2xl border border-rose-800/50 animate-in fade-in">
                <p className="text-xs text-rose-300 font-bold uppercase tracking-wider text-center">Are you absolutely sure?</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/30 active:scale-95"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-slate-800 text-slate-300 text-xs font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
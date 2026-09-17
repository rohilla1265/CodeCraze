// import React from 'react';
// import { Plus, Edit, Trash2, Video } from 'lucide-react';
// import { NavLink } from 'react-router';

// function AdminDashboard() {
//   const adminOptions = [
//     {
//       id: 'create',
//       title: 'Create Problem',
//       description: 'Add a new coding problem to the platform',
//       icon: Plus,
//       color: 'btn-success',
//       bgColor: 'bg-success/10',
//       route: '/admin/create'
//     },
//     {
//       id: 'update',
//       title: 'Update Problem',
//       description: 'Edit existing problems and their details',
//       icon: Edit,
//       color: 'btn-warning',
//       bgColor: 'bg-warning/10',
//       route: '/admin/update'
//     },
//     {
//       id: 'delete',
//       title: 'Delete Problem',
//       description: 'Remove problems from the platform',
//       icon: Trash2,
//       color: 'btn-error',
//       bgColor: 'bg-error/10',
//       route: '/admin/delete'
//     },
//     {
//       id: 'video',
//       title: 'Video Problem',
//       description: 'Upload and delete solution videos',
//       icon: Video,
//       color: 'btn-info',
//       bgColor: 'bg-info/10',
//       route: '/admin/video'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-base-200">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-base-content mb-4">
//             Admin Panel
//           </h1>
//           <p className="text-base-content/70 text-lg">
//             Manage coding problems on your platform
//           </p>
//         </div>

//         {/* Admin Options Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
//           {adminOptions.map((option) => {
//             const IconComponent = option.icon;
//             return (
//               <NavLink
//                 key={option.id}
//                 to={option.route}
//                 className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer no-underline"
//               >
//                 <div className="card-body items-center text-center p-8">
//                   {/* Icon */}
//                   <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
//                     <IconComponent size={32} className="text-base-content" />
//                   </div>

//                   {/* Title */}
//                   <h2 className="card-title text-xl mb-2 text-base-content">
//                     {option.title}
//                   </h2>

//                   {/* Description */}
//                   <p className="text-base-content/70 mb-6 text-sm">
//                     {option.description}
//                   </p>

//                   {/* Action Button */}
//                   <div className="card-actions mt-auto">
//                     <span className={`btn ${option.color} btn-wide`}>
//                       {option.title}
//                     </span>
//                   </div>
//                 </div>
//               </NavLink>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
import React from 'react';
import { Plus, Edit, Trash2, Video,Code2 } from 'lucide-react';
import { NavLink } from 'react-router';

function AdminDashboard() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      borderColor: 'hover:border-emerald-500/50',
      glowBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
      textColor: 'text-emerald-400',
      btnClass: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      borderColor: 'hover:border-amber-500/50',
      glowBg: 'bg-amber-500/10 group-hover:bg-amber-500/20',
      textColor: 'text-amber-400',
      btnClass: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      borderColor: 'hover:border-rose-500/50',
      glowBg: 'bg-rose-500/10 group-hover:bg-rose-500/20',
      textColor: 'text-rose-400',
      btnClass: 'bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-lg shadow-rose-500/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload and delete solution videos',
      icon: Video,
      borderColor: 'hover:border-sky-500/50',
      glowBg: 'bg-sky-500/10 group-hover:bg-sky-500/20',
      textColor: 'text-sky-400',
      btnClass: 'bg-sky-500 hover:bg-sky-600 text-slate-950 font-semibold shadow-lg shadow-sky-500/20',
      route: '/admin/video'
    }
  ];

  return (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
    {/* Full Width Top Header */}
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
            Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
            Manage coding problems & video solutions
          </p>
        </div>

      </div>
    </header>

    {/* Main Options Section */}
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink
                key={option.id}
                to={option.route}
                className={`group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 p-6 border border-slate-800 ${option.borderColor} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60 no-underline backdrop-blur-sm`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${option.glowBg} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className={`w-7 h-7 ${option.textColor}`} />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-slate-100">
                    {option.title}
                  </h2>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {option.description}
                  </p>
                </div>

                <div className="mt-auto pt-2">
                  <span className={`w-full py-2.5 px-4 rounded-xl text-sm transition-all duration-200 text-center block ${option.btnClass}`}>
                    {option.title}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </main>
  </div>
);
}

export default AdminDashboard;
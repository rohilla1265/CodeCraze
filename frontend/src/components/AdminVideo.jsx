import { useEffect, useState } from "react";
import axiosClient from '../../utils/axiosClient';
import { NavLink } from 'react-router';

const AdminVideo = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
        } catch (err) {
            setError(err);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem')) return;
        try {
            // Sahi API route use karein (jaise home page par use kiya hai)
            await axiosClient.delete(`/video/delete/${id}`);
            setProblems(problems => problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError(err);
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg my-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.response?.data?.error || error.message || 'Failed to load data'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Problem Management
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Manage your coding problems, video solutions, and topics.
          </p>
        </div>
      </div>

      {/* Table Card Container */}
      <div className="card bg-base-100 border border-base-200 shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            
            {/* Table Head */}
            <thead className="bg-base-200/60 text-base-content/70 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6">Tags</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-base-200 text-sm font-medium">
              {problems.map((problem, index) => (
                <tr key={problem._id} className="hover:bg-base-200/40 transition-colors duration-150">
                  
                  {/* Serial Number */}
                  <td className="py-4 px-6 text-base-content/50 font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-6 font-semibold text-base-content">
                    {problem.title}
                  </td>

                  {/* Difficulty Badge */}
                  <td className="py-4 px-6">
                    <span className={`badge badge-sm font-semibold px-3 py-2 border-0 ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : problem.difficulty === 'Medium' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).map((tag, idx) => (
                        <span key={idx} className="badge badge-sm badge-ghost border-base-300 text-xs font-normal">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <NavLink 
                        to={`/admin/upload/${problem._id}`}
                        className="btn btn-sm btn-primary btn-soft font-semibold gap-1.5 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload
                      </NavLink>

                      <button 
                        onClick={() => handleDelete(problem._id)}
                        className="btn btn-sm btn-error btn-soft font-semibold gap-1.5 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
    );
};

export default AdminVideo;
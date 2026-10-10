import React from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Code2, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const AVAILABLE_TAGS = [
  "array",
  "linkedList",
  "graph",
  "dp",
  "string",
  "twoPointers",
  "tree",
  "matrix",
  "sorting",
  "binarySearch",
  "recursion",
  "backtracking",
  "greedy",
  "stack",
  "queue",
  "heap",
  "hashing",
  "bitManipulation",
  "slidingWindow",
  "prefixSum",
  "trie",
  "segmentTree",
  "disjointSet",
  "graphTraversal",
  "shortestPath",
  "minimumSpanningTree",
  "topologicalSort",
  "memoization",
  "tabulation",
  "intervals",
  "math",
  "geometry",
  "gameTheory",
  "randomized"
];

// --- Validation Schema ---
const ProblemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.coerce
    .number({ invalid_type_error: 'Points must be a number' })
    .min(5, 'Minimum points must be at least 5'),
  tags: z.array(z.string()).min(1, 'Select at least one tag'),

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

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ProblemSchema),
    defaultValues: {
      points: 5,
      tags: [],
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

  const selectedTags = watch('tags') || [];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setValue(
        'tags',
        selectedTags.filter((t) => t !== tag),
        { shouldValidate: true }
      );
    } else {
      setValue('tags', [...selectedTags, tag], { shouldValidate: true });
    }
  };

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
        problemCreator: '65f1234567890abcdef12345'
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

                {/* Title Input */}
                <div className="md:col-span-3 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Title</label>
                  <input
                    {...register('title')}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder:text-slate-600 transition-all"
                    placeholder="e.g. Optimized Array Merging"
                  />
                  {errors.title && <p className="text-rose-400 text-xs ml-1">{errors.title.message}</p>}
                </div>

                {/* Difficulty Input */}
                <div className="md:col-span-2 space-y-2">
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

                {/* Points Input */}
                <div className="md:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Points</label>
                  <input
                    type="number"
                    min="5"
                    {...register('points')}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder:text-slate-600 transition-all"
                    placeholder="Min 5"
                  />
                  {errors.points && <p className="text-rose-400 text-xs ml-1">{errors.points.message}</p>}
                </div>

                {/* Multiple Tags Selection */}
                <div className="md:col-span-6 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Tags (Select Multiple)
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVAILABLE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                            }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {errors.tags && <p className="text-rose-400 text-xs ml-1">{errors.tags.message}</p>}
                </div>

                {/* Problem Description */}
                <div className="md:col-span-6 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Problem Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 h-40 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 transition-all resize-none"
                    placeholder="Explain the problem requirements..."
                  />
                  {errors.description && <p className="text-rose-400 text-xs ml-1">{errors.description.message}</p>}
                </div>

              </div>
            </div>

            {/* Section 2: Test Environment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Public Cases */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col h-[620px] backdrop-blur-sm shadow-xl">
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
                      <div className="space-y-3 font-mono">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Input</label>
                          <textarea
                            {...register(`visibleTestcases.${index}.input`)}
                            placeholder="nums = [1,2,3]"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 h-20 resize-y"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Output</label>
                          <textarea
                            {...register(`visibleTestcases.${index}.output`)}
                            placeholder="[1,2,3]"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 h-16 resize-y"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Explanation</label>
                          <textarea
                            {...register(`visibleTestcases.${index}.explaination`)}
                            placeholder="Explanation..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 focus:outline-none h-14 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Cases */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col h-[620px] backdrop-blur-sm shadow-xl">
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
                      <div className="space-y-3 font-mono">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Secret Input</label>
                          <textarea
                            {...register(`hiddenTestcases.${index}.input`)}
                            placeholder="Secret Input..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 text-slate-200 h-20 resize-y"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-wider">Secret Output</label>
                          <textarea
                            {...register(`hiddenTestcases.${index}.output`)}
                            placeholder="Secret Output..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 text-slate-200 h-16 resize-y"
                          />
                        </div>
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
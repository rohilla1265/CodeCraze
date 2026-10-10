import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { loginUser } from "../../authSlice";
import { Eye, EyeOff, UserCheck, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null); // Tracks active state
    const { isauth, loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        if (isauth) {
            navigate('/');
        }
    }, [isauth, navigate]);

    const submitdata = (data) => {
        console.log("Form Data Submitted:", data);
        alert("Form submitted!!");
        dispatch(loginUser(data));
    };

    const handleQuickFill = (email, password, role) => {
        setValue("email", email, { shouldValidate: true });
        setValue("password", password, { shouldValidate: true });
        setSelectedRole(role);
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-black via-blue-900 to-white flex items-center justify-center p-4 md:p-8">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                
                {/* LEFT SIDE: Content */}
                <div className="flex flex-col space-y-4 md:space-y-6 text-white text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                        Master <span className="text-green-400">Coding</span> <br />
                        With Our Platform.
                    </h1>
                    <p className="text-zinc-300 text-base md:text-xl max-w-md mx-auto md:mx-0 opacity-90">
                        Join thousands of developers solving complex problems and 
                        improving their algorithmic skills every day.
                    </p>
                    <ul className="hidden sm:block space-y-3 md:space-y-4 text-left mx-auto md:mx-0">
                        <li className="flex items-center gap-3 text-zinc-200">
                            <div className="h-2 w-2 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></div>
                            Access to 2000+ coding questions
                        </li>
                        <li className="flex items-center gap-3 text-zinc-200">
                            <div className="h-2 w-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]"></div>
                            Real-time Judge0 compiler integration
                        </li>
                    </ul>
                </div>

                {/* RIGHT SIDE: Login Form */}
                <div className="flex justify-center md:justify-end">
                    <div className="w-full max-w-md bg-zinc-950/70 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 
                            transition-all duration-500 ease-in-out
                            hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:-translate-y-2">
                        
                        <div className="mb-6 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white mb-2">Login to your Account</h2>
                            <p className="text-zinc-500 text-sm">Start your journey today with our community</p>
                        </div>

                        {/* Quick Direct Login Buttons with Active State Styling */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => handleQuickFill("guestuser123@gmail.com", "Guestuser@123", "user")}
                                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold transition-all border ${
                                    selectedRole === "user"
                                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                                }`}
                            >
                                <UserCheck size={15} />
                                Fill Guest User
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill("guestadmin123@gmail.com", "Guestadmin@123", "admin")}
                                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold transition-all border ${
                                    selectedRole === "admin"
                                        ? "bg-green-600/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                                        : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                                }`}
                            >
                                <ShieldCheck size={15} />
                                Fill Guest Admin
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(submitdata)} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input 
                                    {...register('email')} 
                                    placeholder="mail@example.com" 
                                    className="w-full bg-black/40 border border-zinc-800 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-zinc-800 text-white px-4 py-3.5 pr-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <button className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold rounded-xl shadow-xl transition-all active:scale-95 mt-4 tracking-wide">
                                Login now
                            </button>
                            <p className="text-zinc-400 text-sm mt-6 text-center">
                                Don't have any account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                                >
                                    sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
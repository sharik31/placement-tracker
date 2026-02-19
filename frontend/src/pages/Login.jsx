import { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const BRANCHES = [
    'Computer Engineering',
    'Electronics & Comm.',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'MBA',
    'MCA',
    'B.Com (H)',
    'BBA',
];

export default function Login({ onLogin }) {
    const [mode, setMode] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [branch, setBranch] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        if (!studentName.trim() || !branch) { setError('Please enter your name and select a branch'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE}/auth/student/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ name: studentName.trim(), branch }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            onLogin(data.user, data.token);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminEmail.trim() || !adminPassword) { setError('Please enter email and password'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE}/auth/admin/login`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            onLogin(data.user, data.token);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-grid bg-noise relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="fixed top-[-30%] left-[-15%] w-[600px] h-[600px] bg-jmi-600/10 rounded-full blur-[150px] pointer-events-none spin-slow" />
            <div className="fixed bottom-[-30%] right-[-15%] w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed top-[40%] right-[10%] w-[300px] h-[300px] bg-accent-600/6 rounded-full blur-[120px] pointer-events-none float-animation" />

            <div className="w-full max-w-[420px] relative z-10">
                {/* Logo & Branding */}
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block mb-5">
                        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-2.5 backdrop-blur-sm">
                            <img
                                src="/jmi-logo.png"
                                alt="Jamia Millia Islamia"
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                    <h1 className="text-[28px] font-extrabold tracking-tight text-gradient mb-1.5">
                        JMI Placement Tracker
                    </h1>
                    <p className="text-[13px] text-slate-500 font-medium tracking-wide uppercase">
                        Student Placement Cell — Jamia Millia Islamia
                    </p>
                </div>

                {/* Role Selector */}
                <div className="flex gap-1.5 p-1.5 mb-6 glass-card-static fade-in fade-in-delay-1">
                    <button
                        onClick={() => { setMode('student'); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] text-sm font-semibold transition-all duration-300 cursor-pointer ${mode === 'student'
                                ? 'bg-gradient-to-r from-jmi-700 to-jmi-600 text-white shadow-lg shadow-jmi-600/30'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                            }`}
                    >
                        <GraduationCap className="w-[18px] h-[18px]" />
                        Student
                    </button>
                    <button
                        onClick={() => { setMode('admin'); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] text-sm font-semibold transition-all duration-300 cursor-pointer ${mode === 'admin'
                                ? 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-600/30'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                            }`}
                    >
                        <ShieldCheck className="w-[18px] h-[18px]" />
                        SPC Admin
                    </button>
                </div>

                {/* Form Card */}
                <div className="glass-card p-7 fade-in fade-in-delay-2">
                    {/* Header inside card */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-white">
                            {mode === 'student' ? 'Student Sign In' : 'Admin Sign In'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {mode === 'student'
                                ? 'Enter your details to access placement data'
                                : 'Authorized SPC members only'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 rounded-[14px] bg-rose-500/8 border border-rose-500/15 text-rose-400 text-sm font-medium flex items-start gap-2">
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {mode === 'student' ? (
                        <form onSubmit={handleStudentLogin} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Full Name</label>
                                <input
                                    type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="e.g. Ahmed Khan"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Branch / Department</label>
                                <select
                                    value={branch} onChange={(e) => setBranch(e.target.value)}
                                    className="input-field appearance-none cursor-pointer"
                                >
                                    <option value="">Select your branch</option>
                                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full btn-primary py-3.5 text-[15px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In as Student <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <Sparkles className="w-3 h-3 text-slate-600" />
                                <p className="text-[11px] text-slate-600 font-medium">Read-only access to all placement data</p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Admin Email</label>
                                <input
                                    type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@jmi.ac.in"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="input-field pr-12"
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-3.5 text-[15px] mt-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white font-semibold rounded-[14px] shadow-lg shadow-accent-600/30 transition-all duration-300 cursor-pointer"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In as Admin <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <ShieldCheck className="w-3 h-3 text-slate-600" />
                                <p className="text-[11px] text-slate-600 font-medium">Full edit access — add, edit, delete entries</p>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-[11px] text-slate-700 text-center mt-8 font-medium">
                    © 2026 Student Placement Cell, Jamia Millia Islamia
                </p>
            </div>
        </div>
    );
}

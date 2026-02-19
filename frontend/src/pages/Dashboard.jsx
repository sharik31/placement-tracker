import { useState, useEffect, useCallback } from 'react';
import {
    LogOut, Building2, Clock, CheckCircle2, TrendingUp,
    Plus, Calendar, Users, Briefcase, Search, Filter
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import UpcomingCard from '../components/UpcomingCard.jsx';
import OngoingCard from '../components/OngoingCard.jsx';
import CompletedCard from '../components/CompletedCard.jsx';
import UpcomingForm from '../components/UpcomingForm.jsx';
import OngoingForm from '../components/OngoingForm.jsx';
import CompletedForm from '../components/CompletedForm.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
    const token = localStorage.getItem('pt_token');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [upcoming, setUpcoming] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = user.role === 'admin';

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const opts = { headers, credentials: 'include' };
            const [u, o, c] = await Promise.all([
                fetch(`${API_BASE}/upcoming`, opts).then(r => r.json()),
                fetch(`${API_BASE}/ongoing`, opts).then(r => r.json()),
                fetch(`${API_BASE}/completed`, opts).then(r => r.json()),
            ]);
            setUpcoming(Array.isArray(u) ? u : []);
            setOngoing(Array.isArray(o) ? o : []);
            setCompleted(Array.isArray(c) ? c : []);
        } catch (err) { console.error('Fetch error:', err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAdd = () => { setModalMode('add'); setEditingItem(null); setModalOpen(true); };
    const handleEdit = (item) => { setModalMode('edit'); setEditingItem(item); setModalOpen(true); };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        try {
            await fetch(`${API_BASE}/${activeTab}/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
            fetchData();
        } catch (err) { console.error('Delete error:', err); }
    };

    const handleFormSubmit = async (formData) => {
        const url = modalMode === 'edit' ? `${API_BASE}/${activeTab}/${editingItem.id}` : `${API_BASE}/${activeTab}`;
        try {
            await fetch(url, { method: modalMode === 'edit' ? 'PUT' : 'POST', headers: getAuthHeaders(), credentials: 'include', body: JSON.stringify(formData) });
            setModalOpen(false);
            fetchData();
        } catch (err) { console.error('Submit error:', err); }
    };

    const totalPlaced = completed.reduce((sum, d) => sum + (d.selectedCount || 0), 0);

    const filterBySearch = (items) => {
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(q));
    };

    const tabs = [
        { key: 'upcoming', label: 'Upcoming', icon: Calendar, count: upcoming.length, accent: 'amber' },
        { key: 'ongoing', label: 'Ongoing', icon: Clock, count: ongoing.length, accent: 'primary' },
        { key: 'completed', label: 'Completed', icon: CheckCircle2, count: completed.length, accent: 'emerald' },
    ];

    const stats = [
        { label: 'Upcoming', value: upcoming.length, icon: Calendar, gradient: 'from-amber-500 to-amber-400', glow: 'stat-glow-amber', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
        { label: 'Active Drives', value: ongoing.length, icon: Briefcase, gradient: 'from-primary-500 to-primary-400', glow: 'stat-glow-blue', iconBg: 'bg-primary-500/10', iconColor: 'text-primary-400' },
        { label: 'Completed', value: completed.length, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-400', glow: 'stat-glow-emerald', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
        { label: 'Students Placed', value: totalPlaced, icon: TrendingUp, gradient: 'from-accent-500 to-accent-400', glow: 'stat-glow-accent', iconBg: 'bg-accent-500/10', iconColor: 'text-accent-400' },
    ];

    const currentData = activeTab === 'upcoming' ? filterBySearch(upcoming) : activeTab === 'ongoing' ? filterBySearch(ongoing) : filterBySearch(completed);

    return (
        <div className="min-h-screen bg-noise bg-grid">
            {/* ═══════ Top Bar ═══════ */}
            <header className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/jmi-logo.png" alt="JMI" className="w-9 h-9 object-contain" />
                        <div>
                            <h1 className="text-[15px] font-bold text-white leading-none">JMI Placement Tracker</h1>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide uppercase">Student Placement Cell</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white leading-none">{user.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                {isAdmin ? 'SPC Administrator' : user.branch}
                            </p>
                        </div>
                        <div className={`h-7 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center ${isAdmin
                                ? 'bg-accent-600/15 text-accent-400 border border-accent-500/20'
                                : 'bg-jmi-600/15 text-jmi-400 border border-jmi-500/20'
                            }`}>
                            {isAdmin ? 'Admin' : 'Student'}
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
                {/* ═══════ Stats Strip ═══════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className={`glass-card p-5 flex items-center gap-4 ${stat.glow} fade-in fade-in-delay-${i + 1}`}>
                            <div className={`w-11 h-11 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-[28px] font-extrabold text-white leading-none tracking-tight">
                                    {loading ? '—' : stat.value}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══════ Controls Row ═══════ */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex gap-1 p-1 glass-card-static">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            const activeClasses = tab.accent === 'amber'
                                ? 'bg-amber-500/10 text-amber-400'
                                : tab.accent === 'primary'
                                    ? 'bg-primary-500/10 text-primary-400'
                                    : 'bg-emerald-500/10 text-emerald-400';

                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 py-2 px-3.5 rounded-[14px] text-[13px] font-semibold transition-all duration-300 cursor-pointer ${isActive ? activeClasses : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className={`min-w-[20px] h-5 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-white/[0.03] text-slate-600'
                                        }`}>{tab.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-9 py-2 text-[13px] sm:w-56"
                            />
                        </div>

                        {/* Add Button (admin) */}
                        {isAdmin && (
                            <button onClick={handleAdd} className="btn-primary whitespace-nowrap">
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add New</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ═══════ Content Grid ═══════ */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="glass-card p-6">
                                <div className="shimmer h-5 w-3/4 mb-4" />
                                <div className="shimmer h-4 w-1/2 mb-3" />
                                <div className="shimmer h-4 w-full" />
                            </div>
                        ))}
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="glass-card p-16 text-center fade-in">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mx-auto mb-5">
                            <Building2 className="w-7 h-7 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-300">
                            {searchQuery ? 'No results found' : 'No entries yet'}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1.5 max-w-xs mx-auto">
                            {searchQuery
                                ? `No companies matching "${searchQuery}"`
                                : isAdmin
                                    ? `Click "Add New" to create your first ${activeTab} entry`
                                    : `No ${activeTab} entries available right now`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {activeTab === 'upcoming' && currentData.map((item, i) => (
                            <UpcomingCard key={item.id} item={item} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} index={i} />
                        ))}
                        {activeTab === 'ongoing' && currentData.map((item, i) => (
                            <OngoingCard key={item.id} item={item} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} index={i} />
                        ))}
                        {activeTab === 'completed' && currentData.map((item, i) => (
                            <CompletedCard key={item.id} item={item} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} index={i} />
                        ))}
                    </div>
                )}
            </main>

            {/* ═══════ Modal ═══════ */}
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)} title={`${modalMode === 'edit' ? 'Edit' : 'Add'} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}>
                    {activeTab === 'upcoming' && <UpcomingForm initial={editingItem} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />}
                    {activeTab === 'ongoing' && <OngoingForm initial={editingItem} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />}
                    {activeTab === 'completed' && <CompletedForm initial={editingItem} onSubmit={handleFormSubmit} onCancel={() => setModalOpen(false)} />}
                </Modal>
            )}
        </div>
    );
}

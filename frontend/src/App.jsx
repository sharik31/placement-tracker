import { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Validate session against server
        const savedUser = localStorage.getItem('pt_user');
        const savedToken = localStorage.getItem('pt_token');
        if (savedUser && savedToken) {
            fetch(`${API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${savedToken}` },
                credentials: 'include',
            })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(data => setUser(data.user))
                .catch(() => {
                    localStorage.removeItem('pt_user');
                    localStorage.removeItem('pt_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = (userData, token) => {
        setUser(userData);
        localStorage.setItem('pt_user', JSON.stringify(userData));
        localStorage.setItem('pt_token', token);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('pt_user');
        localStorage.removeItem('pt_token');
        fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return <Dashboard user={user} onLogout={handleLogout} />;
}

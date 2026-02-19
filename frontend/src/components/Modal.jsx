import { X } from 'lucide-react';

export default function Modal({ onClose, title, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card p-7 fade-in" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Fill in the details below</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

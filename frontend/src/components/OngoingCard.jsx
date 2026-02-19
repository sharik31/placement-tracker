import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2, ExternalLink, Clock, Activity, Zap } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';

export default function OngoingCard({ item, isAdmin, onEdit, onDelete, index }) {
    const [expanded, setExpanded] = useState(false);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (item.status !== 'gform' || !item.gformDeadline) return;
        const update = () => {
            const deadline = new Date(item.gformDeadline);
            setCountdown(isPast(deadline) ? 'Expired' : formatDistanceToNow(deadline, { addSuffix: false }) + ' left');
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [item.gformDeadline, item.status]);

    const progressPercent = item.totalRounds > 0 ? Math.round((item.roundNumber / item.totalRounds) * 100) : 0;
    const isExpired = item.gformDeadline && isPast(new Date(item.gformDeadline));

    return (
        <div
            className="glass-card overflow-hidden fade-in border-accent-ongoing"
            style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
        >
            <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-4 h-4 text-primary-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-[15px] font-bold text-white truncate">{item.name}</h3>

                                {item.status === 'gform' ? (
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/15">
                                            <ExternalLink className="w-2.5 h-2.5" /> FORM
                                        </span>
                                        {item.gformDeadline && (
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${isExpired
                                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                                                }`}>
                                                <Clock className="w-2.5 h-2.5" /> {countdown}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-1.5 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-accent-500/10 text-accent-400 border border-accent-500/15">
                                                <Activity className="w-2.5 h-2.5" /> {item.currentRound || `Round ${item.roundNumber}`}
                                            </span>
                                            <span className="text-[11px] text-slate-600 font-semibold">{item.roundNumber}/{item.totalRounds}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 rounded-full progress-animate"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                        {isAdmin && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-primary-400 hover:bg-primary-500/10 transition-all cursor-pointer">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600">
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="px-5 pb-5 border-t border-white/[0.04] pt-4 space-y-3 fade-in">
                    <div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Job Description</p>
                        <p className="text-[13px] text-slate-300 leading-relaxed">{item.jd}</p>
                    </div>
                    {item.status === 'gform' && item.gformLink && (
                        <a href={item.gformLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600/10 border border-primary-500/15 text-primary-400 hover:bg-primary-600/20 rounded-xl text-[13px] font-semibold transition-all">
                            <ExternalLink className="w-4 h-4" /> Open Application Form
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

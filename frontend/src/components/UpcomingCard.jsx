import { useState } from 'react';
import { Calendar, Paperclip, ChevronDown, ChevronUp, Pencil, Trash2, Info, MapPin } from 'lucide-react';
import { format, formatDistanceToNow, isFuture } from 'date-fns';

export default function UpcomingCard({ item, isAdmin, onEdit, onDelete, index }) {
    const [expanded, setExpanded] = useState(false);

    const date = item.tentativeDate ? new Date(item.tentativeDate) : null;
    const dateStr = date ? format(date, 'dd MMM yyyy') : 'TBD';
    const timeUntil = date && isFuture(date) ? formatDistanceToNow(date, { addSuffix: false }) : null;

    return (
        <div
            className="glass-card overflow-hidden fade-in border-accent-upcoming"
            style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
        >
            <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-base">🏢</span>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[15px] font-bold text-white truncate">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-1 text-[12px] text-amber-400/80">
                                        <Calendar className="w-3 h-3" />
                                        <span className="font-medium">{dateStr}</span>
                                    </div>
                                    {timeUntil && (
                                        <span className="text-[11px] text-slate-600 font-medium">• in {timeUntil}</span>
                                    )}
                                </div>
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
                    {item.info && (
                        <div className="flex gap-2.5 p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/[0.08]">
                            <Info className="w-4 h-4 text-amber-400/60 mt-0.5 flex-shrink-0" />
                            <p className="text-[13px] text-slate-300 leading-relaxed">{item.info}</p>
                        </div>
                    )}
                    {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[13px] text-primary-400 font-medium transition-all">
                            <Paperclip className="w-3.5 h-3.5" />
                            {item.attachmentName || 'View Attachment'}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

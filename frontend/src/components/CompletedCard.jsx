import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2, Download, Users, Phone, Mail, User, Award } from 'lucide-react';

export default function CompletedCard({ item, isAdmin, onEdit, onDelete, index }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="glass-card overflow-hidden fade-in border-accent-completed"
            style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
        >
            <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Award className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[15px] font-bold text-white truncate">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                        <Users className="w-2.5 h-2.5" /> {item.selectedCount} placed
                                    </span>
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
                <div className="px-5 pb-5 border-t border-white/[0.04] pt-4 space-y-4 fade-in">
                    <div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Job Description</p>
                        <p className="text-[13px] text-slate-300 leading-relaxed">{item.jd}</p>
                    </div>

                    {/* Attachments */}
                    {(item.finalListUrl || item.selectedListUrl) && (
                        <div className="flex flex-wrap gap-2">
                            {item.finalListUrl && (
                                <a href={item.finalListUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[12px] text-slate-300 font-medium transition-all">
                                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                                    {item.finalListName || 'Final List'}
                                </a>
                            )}
                            {item.selectedListUrl && (
                                <a href={item.selectedListUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[12px] text-slate-300 font-medium transition-all">
                                    <Download className="w-3.5 h-3.5 text-primary-400" />
                                    {item.selectedListName || 'Selected List'}
                                </a>
                            )}
                        </div>
                    )}

                    {/* SPC Member */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2.5">Compiled By</p>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[13px] text-slate-300 font-medium">
                                <User className="w-3.5 h-3.5 text-slate-500" /> {item.spcMemberName}
                            </div>
                            {item.spcMemberPhone && (
                                <div className="flex items-center gap-2 text-[12px] text-slate-500">
                                    <Phone className="w-3 h-3" /> {item.spcMemberPhone}
                                </div>
                            )}
                            {item.spcMemberEmail && (
                                <div className="flex items-center gap-2 text-[12px] text-slate-500">
                                    <Mail className="w-3 h-3" /> {item.spcMemberEmail}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

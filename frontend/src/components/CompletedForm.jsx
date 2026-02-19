import { useState } from 'react';

export default function CompletedForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: initial?.name || '', jd: initial?.jd || '',
        finalListName: initial?.finalListName || '', finalListUrl: initial?.finalListUrl || '',
        selectedListName: initial?.selectedListName || '', selectedListUrl: initial?.selectedListUrl || '',
        selectedCount: initial?.selectedCount || 0, spcMemberName: initial?.spcMemberName || '',
        spcMemberPhone: initial?.spcMemberPhone || '', spcMemberEmail: initial?.spcMemberEmail || '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'selectedCount' ? parseInt(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
    const lbl = "block text-[13px] font-semibold text-slate-400 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className={lbl}>Company Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g. Wipro" /></div>
            <div><label className={lbl}>Job Description *</label>
                <textarea name="jd" value={form.jd} onChange={handleChange} required rows={2} className="input-field" placeholder="Role, CTC, location..." /></div>
            <div><label className={lbl}>Students Selected</label>
                <input name="selectedCount" type="number" min="0" value={form.selectedCount} onChange={handleChange} className="input-field" /></div>

            <div className="border-t border-white/[0.04] pt-4">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Attachments</p>
                <div className="space-y-3">
                    <div><label className={lbl}>Final List Name</label><input name="finalListName" value={form.finalListName} onChange={handleChange} className="input-field" placeholder="e.g. Company_Shortlisted.pdf" /></div>
                    <div><label className={lbl}>Final List URL</label><input name="finalListUrl" value={form.finalListUrl} onChange={handleChange} className="input-field" placeholder="https://drive.google.com/..." /></div>
                    <div><label className={lbl}>Selected List Name</label><input name="selectedListName" value={form.selectedListName} onChange={handleChange} className="input-field" placeholder="e.g. Company_Selected.pdf" /></div>
                    <div><label className={lbl}>Selected List URL</label><input name="selectedListUrl" value={form.selectedListUrl} onChange={handleChange} className="input-field" placeholder="https://drive.google.com/..." /></div>
                </div>
            </div>

            <div className="border-t border-white/[0.04] pt-4">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">SPC Member Info</p>
                <div className="space-y-3">
                    <div><label className={lbl}>Name *</label><input name="spcMemberName" value={form.spcMemberName} onChange={handleChange} required className="input-field" placeholder="Full name" /></div>
                    <div><label className={lbl}>Phone</label><input name="spcMemberPhone" value={form.spcMemberPhone} onChange={handleChange} className="input-field" placeholder="+91-9876543210" /></div>
                    <div><label className={lbl}>Email</label><input name="spcMemberEmail" value={form.spcMemberEmail} onChange={handleChange} type="email" className="input-field" placeholder="name@jmi.ac.in" /></div>
                </div>
            </div>

            <div className="flex gap-3 pt-3">
                <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save</button>
            </div>
        </form>
    );
}

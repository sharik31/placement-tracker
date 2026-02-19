import { useState } from 'react';

export default function UpcomingForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: initial?.name || '', tentativeDate: initial?.tentativeDate ? initial.tentativeDate.split('T')[0] : '',
        info: initial?.info || '', attachmentName: initial?.attachmentName || '', attachmentUrl: initial?.attachmentUrl || '',
    });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-[13px] font-semibold text-slate-400 mb-2">Company Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g. Google India" /></div>
            <div><label className="block text-[13px] font-semibold text-slate-400 mb-2">Tentative Date *</label>
                <input name="tentativeDate" type="date" value={form.tentativeDate} onChange={handleChange} required className="input-field" /></div>
            <div><label className="block text-[13px] font-semibold text-slate-400 mb-2">Critical Info / Eligibility</label>
                <textarea name="info" value={form.info} onChange={handleChange} rows={3} className="input-field" placeholder="CGPA cutoff, eligible branches, etc." /></div>
            <div><label className="block text-[13px] font-semibold text-slate-400 mb-2">Attachment Name</label>
                <input name="attachmentName" value={form.attachmentName} onChange={handleChange} className="input-field" placeholder="e.g. Eligibility.pdf" /></div>
            <div><label className="block text-[13px] font-semibold text-slate-400 mb-2">Attachment URL</label>
                <input name="attachmentUrl" value={form.attachmentUrl} onChange={handleChange} className="input-field" placeholder="https://drive.google.com/..." /></div>
            <div className="flex gap-3 pt-3">
                <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save</button>
            </div>
        </form>
    );
}

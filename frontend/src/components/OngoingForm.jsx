import { useState } from 'react';

export default function OngoingForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: initial?.name || '', jd: initial?.jd || '', status: initial?.status || 'gform',
        currentRound: initial?.currentRound || '', roundNumber: initial?.roundNumber || 0,
        totalRounds: initial?.totalRounds || 0, gformLink: initial?.gformLink || '',
        gformDeadline: initial?.gformDeadline ? initial.gformDeadline.slice(0, 16) : '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'roundNumber' || name === 'totalRounds' ? parseInt(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };
    const lbl = "block text-[13px] font-semibold text-slate-400 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className={lbl}>Company Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g. Microsoft" /></div>
            <div><label className={lbl}>Job Description *</label>
                <textarea name="jd" value={form.jd} onChange={handleChange} required rows={3} className="input-field" placeholder="Role, location, CTC, skills..." /></div>
            <div><label className={lbl}>Status *</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field appearance-none cursor-pointer">
                    <option value="gform">Google Form Created</option>
                    <option value="round">Rounds Ongoing</option>
                </select></div>
            {form.status === 'gform' ? (
                <>
                    <div><label className={lbl}>Google Form Link</label>
                        <input name="gformLink" value={form.gformLink} onChange={handleChange} className="input-field" placeholder="https://forms.google.com/..." /></div>
                    <div><label className={lbl}>Form Deadline</label>
                        <input name="gformDeadline" type="datetime-local" value={form.gformDeadline} onChange={handleChange} className="input-field" /></div>
                </>
            ) : (
                <>
                    <div><label className={lbl}>Current Round Name</label>
                        <input name="currentRound" value={form.currentRound} onChange={handleChange} className="input-field" placeholder="e.g. Technical Interview Round 2" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={lbl}>Round #</label>
                            <input name="roundNumber" type="number" min="0" value={form.roundNumber} onChange={handleChange} className="input-field" /></div>
                        <div><label className={lbl}>Total Rounds</label>
                            <input name="totalRounds" type="number" min="0" value={form.totalRounds} onChange={handleChange} className="input-field" /></div>
                    </div>
                </>
            )}
            <div className="flex gap-3 pt-3">
                <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save</button>
            </div>
        </form>
    );
}

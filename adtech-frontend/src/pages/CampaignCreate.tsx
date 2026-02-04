import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign, type CampaignStatus } from '../api';

interface FormState {
  name: string;
  advertiser: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  impressions: string;
  clicks: string;
}

const initialState: FormState = {
  name: '',
  advertiser: '',
  budget: '',
  startDate: '',
  endDate: '',
  status: 'paused',
  impressions: '0',
  clicks: '0',
};

export function CampaignCreate() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        advertiser: form.advertiser,
        budget: Number(form.budget),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        impressions: Number(form.impressions) || 0,
        clicks: Number(form.clicks) || 0,
      };

      const created = await createCampaign(payload as any);
      navigate(`/campaigns/${created._id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Nouvelle campagne</h1>
        <p className="text-sm text-slate-500">
          Paramétrez une campagne simple pour suivre budget, impressions et clicks.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Nom *</label>
          <input
            required
            value={form.name}
            onChange={handleChange('name')}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
            placeholder="Campagne CTV Q2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Annonceur *</label>
          <input
            required
            value={form.advertiser}
            onChange={handleChange('advertiser')}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
            placeholder="RetailSpot"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Budget total (€) *</label>
            <input
              required
              type="number"
              min={0}
              value={form.budget}
              onChange={handleChange('budget')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
              placeholder="10000"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Statut initial</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="paused">En pause</option>
              <option value="active">Active</option>
              <option value="finished">Terminée</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Date de début *</label>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={handleChange('startDate')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Date de fin *</label>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={handleChange('endDate')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Impressions (optionnel)</label>
            <input
              type="number"
              min={0}
              value={form.impressions}
              onChange={handleChange('impressions')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Clicks (optionnel)</label>
            <input
              type="number"
              min={0}
              value={form.clicks}
              onChange={handleChange('clicks')}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? 'Création...' : 'Créer la campagne'}
          </button>
        </div>
      </form>
    </div>
  );
}



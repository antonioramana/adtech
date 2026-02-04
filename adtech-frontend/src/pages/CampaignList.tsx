import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Campaign, CampaignStatus } from '../api';
import { fetchCampaigns } from '../api';
import { CampaignStatusBadge } from '../components/CampaignStatusBadge';

function computeCtr(campaign: Campaign) {
  if (!campaign.impressions) return 0;
  return (campaign.clicks / campaign.impressions) * 100;
}

export function CampaignList() {
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [data, setData] = useState<Campaign[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchCampaigns({
          status: statusFilter === 'all' ? undefined : statusFilter,
        });
        setData(res.data);
        setTotal(res.total);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [statusFilter]);

  const campaignsWithCtr = useMemo(
    () =>
      (data ?? []).map((c) => ({
        ...c,
        ctr: computeCtr(c),
      })),
    [data],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Campagnes</h1>
          <p className="text-sm text-slate-500">
            Vue d&apos;ensemble des performances.
          </p>
        </div>
        <Link
          to="/campaigns/new"
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400"
        >
          + Nouvelle campagne
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs text-slate-600">
          Total campagnes: <span className="font-medium text-slate-900">{total}</span>
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Filtre statut:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900"
          >
            <option value="all">Tous</option>
            <option value="active">Actives</option>
            <option value="paused">En pause</option>
            <option value="finished">Terminées</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
          Chargement des campagnes...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && campaignsWithCtr.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          Aucune campagne pour le moment. Créez votre première campagne pour suivre vos performances.
        </div>
      )}

      {!loading && !error && campaignsWithCtr.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Annonceur</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">Budget (€)</th>
                <th className="px-4 py-3 text-right">Impressions</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignsWithCtr.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/campaigns/${c._id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-600"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.advertiser}</td>
                  <td className="px-4 py-3">
                    <CampaignStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs tabular-nums">
                    {c.budget.toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="px-4 py-3 text-right text-xs tabular-nums">
                    {c.impressions.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right text-xs tabular-nums">
                    {c.clicks.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right text-xs tabular-nums">
                    {c.ctr.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/campaigns/${c._id}`}
                      className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



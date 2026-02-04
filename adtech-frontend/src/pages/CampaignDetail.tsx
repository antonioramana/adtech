import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchCampaign,
  fetchCampaignStats,
  updateCampaignStatus,
  type Campaign,
} from '../api';
import { CampaignStatusBadge } from '../components/CampaignStatusBadge';
import { StatCard } from '../components/StatCard';

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ ctr: number; cpc: number } | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [c, s] = await Promise.all([fetchCampaign(id), fetchCampaignStats(id)]);
        setCampaign(c);
        setStats(s);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!campaign) return;
    try {
      setStatusLoading(true);
      const nextStatus =
        campaign.status === 'active'
          ? 'paused'
          : campaign.status === 'paused'
            ? 'active'
            : 'finished';
      const updated = await updateCampaignStatus(campaign._id, nextStatus);
      setCampaign(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        Chargement de la campagne...
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error ?? "Campagne introuvable"}
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-slate-400">
            {campaign.advertiser} ·{' '}
            <span>
              {start.toLocaleDateString('fr-FR')} → {end.toLocaleDateString('fr-FR')}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Liste
          </Link>
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={statusLoading || campaign.status === 'finished'}
            className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
          >
            {campaign.status === 'active'
              ? 'Mettre en pause'
              : campaign.status === 'paused'
                ? 'Activer'
                : 'Terminée'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="Budget total"
          value={campaign.budget}
          format="currency"
          helper="Budget média alloué"
        />
        <StatCard
          label="Impressions"
          value={campaign.impressions}
          format="integer"
          helper="Nombre d'affichages"
        />
        <StatCard
          label="Clicks"
          value={campaign.clicks}
          format="integer"
          helper="Interactions enregistrées"
        />
        <StatCard
          label="CTR"
          value={stats?.ctr ?? 0}
          format="percent"
          helper="Taux de clics (clicks / impressions)"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Détails média
          </h2>
          <p className="text-slate-800">
            CPC moyen:{' '}
            <span className="font-semibold">
              {stats
                ? `${stats.cpc.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} €`
                : '–'}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            CPC = budget / clicks. Cette vue permet de raisonner en performance média simple
            (sans tracking de conversion).
          </p>
        </div>
      </div>
    </div>
  );
}



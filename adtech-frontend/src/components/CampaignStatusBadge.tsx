import type { CampaignStatus } from '../api';

const STATUS_STYLES: Record<CampaignStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  finished: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: 'Active',
  paused: 'En pause',
  finished: 'Terminée',
};

interface Props {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}



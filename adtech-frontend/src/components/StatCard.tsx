interface Props {
  label: string;
  value: number;
  format: 'currency' | 'integer' | 'percent';
  helper?: string;
}

export function StatCard({ label, value, format, helper }: Props) {
  const formatted =
    format === 'currency'
      ? `${value.toLocaleString('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} €`
      : format === 'integer'
        ? value.toLocaleString('fr-FR')
        : `${value.toFixed(2)} %`;

  return (
    <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900 tabular-nums">{formatted}</p>
      {helper && <p className="text-[11px] text-slate-500">{helper}</p>}
    </div>
  );
}



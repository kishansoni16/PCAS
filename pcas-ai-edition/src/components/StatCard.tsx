interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  colorHex?: string;
  dotColorHex?: string;
}

export default function StatCard({ label, value, subValue, colorHex = 'var(--text)', dotColorHex }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ color: colorHex }}>{value}</div>
      {subValue && (
        <div className="stat-sub">
          {dotColorHex && <span className="stat-dot" style={{ background: dotColorHex }}></span>}
          {subValue}
        </div>
      )}
    </div>
  );
}

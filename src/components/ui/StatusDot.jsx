const DOT_COLORS = {
  novo: 'bg-blue-400', qualificado: 'bg-purple-400', agendado: 'bg-amber-400',
  confirmado: 'bg-emerald-400', realizado: 'bg-gold', perdido: 'bg-red-400',
};

export default function StatusDot({ status, pulse = false }) {
  const color = DOT_COLORS[status] ?? 'bg-gray-400';
  return (
    <span className="relative flex items-center justify-center w-2.5 h-2.5">
      {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-40`} />}
      <span className={`relative inline-flex rounded-full w-2 h-2 ${color}`} />
    </span>
  );
}

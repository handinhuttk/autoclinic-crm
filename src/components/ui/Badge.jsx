const VARIANTS = {
  novo:        'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  qualificado: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  agendado:    'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  confirmado:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  realizado:   'bg-gold/15 text-gold border border-gold/30',
  perdido:     'bg-red-500/15 text-red-400 border border-red-500/30',
};

const LABELS = {
  novo: 'Novo', qualificado: 'Qualificado', agendado: 'Agendado',
  confirmado: 'Confirmado', realizado: 'Realizado', perdido: 'Não Convertido',
};

export default function Badge({ status, className = '' }) {
  const cls = VARIANTS[status] ?? 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {LABELS[status] ?? status}
    </span>
  );
}

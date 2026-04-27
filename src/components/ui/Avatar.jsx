const COLORS = [
  'from-blue-500 to-blue-700', 'from-purple-500 to-purple-700',
  'from-amber-500 to-amber-700', 'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700', 'from-cyan-500 to-cyan-700',
  'from-indigo-500 to-indigo-700', 'from-teal-500 to-teal-700',
];

function colorForInitials(initials) {
  const code = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  return COLORS[code % COLORS.length];
}

export default function Avatar({ initials = '?', size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  const gradient = colorForInitials(initials);
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white shrink-0 ${className}`}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}

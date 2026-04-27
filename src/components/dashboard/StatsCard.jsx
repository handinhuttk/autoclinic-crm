import CountUp from '../ui/CountUp';
import Skeleton from '../ui/Skeleton';

export default function StatsCard({ icon: Icon, label, value, prefix = '', suffix = '', decimals = 0, trend, trendLabel, color = 'gold', loading = false }) {
  const colorMap = {
    gold:    { icon: 'text-gold bg-gold/10', trend: 'text-gold' },
    blue:    { icon: 'text-blue-400 bg-blue-500/10', trend: 'text-blue-400' },
    purple:  { icon: 'text-purple-400 bg-purple-500/10', trend: 'text-purple-400' },
    emerald: { icon: 'text-emerald-400 bg-emerald-500/10', trend: 'text-emerald-400' },
    amber:   { icon: 'text-amber-400 bg-amber-500/10', trend: 'text-amber-400' },
    rose:    { icon: 'text-rose-400 bg-rose-500/10', trend: 'text-rose-400' },
  };
  const c = colorMap[color] ?? colorMap.gold;

  if (loading) {
    return (
      <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    );
  }

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5 hover:border-navy-600/80 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1.5">
            <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          {trendLabel && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

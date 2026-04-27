import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Skeleton from '../ui/Skeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-800 border border-navy-700/80 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name === 'receita' ? 'Receita' : 'Meta'}: R$ {p.value.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  );
};

export default function RevenueChart({ data, loading }) {
  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Receita Mensal</h3>
          <p className="text-gray-500 text-xs mt-0.5">Receita vs meta — últimos 6 meses</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          +16% vs meta
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradMeta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#0F3460" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1E3A5F', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="meta" stroke="#3B82F6" strokeWidth={1.5}
            strokeDasharray="4 3" fill="url(#gradMeta)" name="meta" dot={false} />
          <Area type="monotone" dataKey="receita" stroke="#C9A84C" strokeWidth={2}
            fill="url(#gradReceita)" name="receita" dot={{ r: 3, fill: '#C9A84C', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#E2B95A', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

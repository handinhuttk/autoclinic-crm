import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Skeleton from '../ui/Skeleton';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-navy-800 border border-navy-700/80 rounded-xl p-3 text-xs shadow-xl">
      <p style={{ color: d.fill }} className="font-medium">{d.name}</p>
      <p className="text-gray-400 mt-0.5">{d.value}%</p>
    </div>
  );
};

const renderLegend = ({ payload }) => (
  <ul className="flex flex-col gap-1.5 mt-2">
    {payload.map((entry, i) => (
      <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
        {entry.value} <span className="text-gray-600 ml-auto">{entry.payload.value}%</span>
      </li>
    ))}
  </ul>
);

export default function LeadsChart({ data, loading }) {
  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Origem dos Leads</h3>
        <p className="text-gray-500 text-xs mt-0.5">Distribuição por canal</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="40%" cy="50%" innerRadius={55} outerRadius={85}
            paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Users, CalendarCheck, TrendingUp, DollarSign, Activity, CheckCircle2 } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import ConversionFunnel from '../components/dashboard/ConversionFunnel';
import LeadsChart from '../components/dashboard/LeadsChart';
import RecentAppointments from '../components/dashboard/RecentAppointments';
import { getDashboardStats, getRevenueData, getFunnelData, getOrigemData, getRecentAppointments } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [origem, setOrigem] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRevenueData(),
      getFunnelData(),
      getOrigemData(),
      getRecentAppointments(),
    ]).then(([s, r, f, o, a]) => {
      setStats(s); setRevenue(r); setFunnel(f); setOrigem(o); setAppointments(a);
      setLoading(false);
    });
  }, []);

  const CARDS = [
    { icon: Users,         label: 'Leads Hoje',       key: 'leadsHoje',         color: 'blue',    suffix: '',   trend: 12,  trendLabel: 'vs ontem' },
    { icon: CalendarCheck, label: 'Agendamentos Hoje', key: 'agendamentosHoje',  color: 'purple',  suffix: '',   trend: 8,   trendLabel: 'vs ontem' },
    { icon: TrendingUp,    label: 'Taxa de Conversão', key: 'taxaConversao',     color: 'emerald', suffix: '%',  trend: 4,   trendLabel: 'vs mês anterior' },
    { icon: DollarSign,    label: 'Receita do Mês',    key: 'receitaMes',        color: 'gold',    prefix: 'R$ ',trend: 16,  trendLabel: 'vs mês anterior' },
    { icon: Activity,      label: 'Leads no Mês',      key: 'leadsMes',          color: 'amber',   suffix: '',   trend: 20,  trendLabel: 'vs mês anterior' },
    { icon: CheckCircle2,  label: 'Atendimentos',      key: 'atendimentosMes',   color: 'rose',    suffix: '',   trend: -3,  trendLabel: 'vs mês anterior' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {CARDS.map((card) => (
          <StatsCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={loading ? 0 : (stats?.[card.key] ?? 0)}
            prefix={card.prefix ?? ''}
            suffix={card.suffix}
            color={card.color}
            trend={card.trend}
            trendLabel={card.trendLabel}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={revenue} loading={loading} />
        </div>
        <LeadsChart data={origem} loading={loading} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ConversionFunnel data={funnel} loading={loading} />
        </div>
        <RecentAppointments data={appointments} loading={loading} />
      </div>
    </div>
  );
}

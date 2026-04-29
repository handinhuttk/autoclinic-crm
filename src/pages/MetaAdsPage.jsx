import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  DollarSign, Users, Target, MousePointer, TrendingUp, Eye,
  RefreshCw, BarChart2, CheckCircle2, ChevronUp, ChevronDown,
  X, ExternalLink, AlertCircle,
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import {
  getMetaAdsOverview, getMetaAdsCampaigns, getMetaAdsTimeline,
  getMetaAdsComparison, connectMetaAds, syncMetaAds,
} from '../services/api';

// ─── Período selector ─────────────────────────────────────────────────────────
const PERIODS = [
  { label: '7 dias',  days: 7  },
  { label: '15 dias', days: 15 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
];

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, sub, color, loading }) {
  if (loading) return <Skeleton className="h-28 rounded-2xl" />;
  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-white text-2xl font-bold leading-none mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{label}</p>
      {sub && <p className="text-gray-600 text-[10px] mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-xl px-3.5 py-2.5 text-xs shadow-2xl">
      <p className="text-gray-400 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value, p.name) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Connect modal ────────────────────────────────────────────────────────────
function ConnectModal({ onClose, onConnected }) {
  const [step, setStep]       = useState(1);
  const [token, setToken]     = useState('');
  const [accountId, setAccId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleConnect = async () => {
    if (!token || !accountId) return setError('Preencha os dois campos.');
    setLoading(true); setError('');
    try {
      const res = await connectMetaAds({ accessToken: token, adAccountId: accountId });
      onConnected(res);
    } catch (e) {
      setError(e.message || 'Erro ao conectar. Verifique o token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-800 border border-navy-700/60 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-gold" />
            <h2 className="text-white font-semibold text-sm">Conectar Meta Ads</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Steps */}
          <div className="space-y-3">
            {[
              { n: 1, text: 'Acesse developers.facebook.com e crie um App do tipo "Business"' },
              { n: 2, text: 'Vá em Ferramentas → Explorador de API → gere um token com permissão ads_read' },
              { n: 3, text: 'Cole o token e o ID da conta de anúncios abaixo (sem "act_")' },
            ].map(({ n, text }) => (
              <div key={n} className="flex gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5
                  ${step >= n ? 'bg-gold text-navy-900' : 'bg-navy-700 text-gray-500'}`}>{n}</span>
                <p className="text-gray-400 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Access Token</p>
              <input value={token} onChange={(e) => { setToken(e.target.value); setStep(3); }}
                placeholder="EAAxxxxxxxxxx..."
                className="w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Ad Account ID (sem "act_")</p>
              <input value={accountId} onChange={(e) => setAccId(e.target.value)}
                placeholder="1234567890"
                className="w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] text-gold hover:text-gold-light transition-colors">
            <ExternalLink size={11} /> Abrir Explorador de API do Meta
          </a>
        </div>

        <div className="flex gap-2 p-5 border-t border-navy-700/50">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-gray-400 border border-navy-700/60 hover:border-navy-600 hover:text-white transition-colors">
            Cancelar
          </button>
          <button onClick={handleConnect} disabled={loading || !token || !accountId}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-navy-900 bg-gold hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? 'Validando…' : 'Validar e Conectar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaigns table ──────────────────────────────────────────────────────────
function CampaignsTable({ campaigns, loading }) {
  const [sortKey, setSortKey]   = useState('spend');
  const [sortDir, setSortDir]   = useState('desc');

  const sorted = [...(campaigns || [])].sort((a, b) =>
    sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
  );

  const avgCpl = campaigns?.length
    ? campaigns.reduce((s, c) => s + c.cpl, 0) / campaigns.length
    : 0;

  const totals = (campaigns || []).reduce(
    (acc, c) => ({ spend: acc.spend + c.spend, leads: acc.leads + c.leads, clicks: acc.clicks + c.clicks }),
    { spend: 0, leads: 0, clicks: 0 }
  );

  const HeaderCell = ({ label, k }) => (
    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-gray-300 transition-colors"
      onClick={() => { setSortKey(k); setSortDir((d) => sortKey === k && d === 'desc' ? 'asc' : 'desc'); }}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k
          ? sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />
          : null}
      </span>
    </th>
  );

  if (loading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-navy-700/40">
        <h3 className="text-white font-semibold text-sm">Performance por Campanha</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-700/40">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Campanha</th>
              <HeaderCell label="Gasto"  k="spend"  />
              <HeaderCell label="Leads"  k="leads"  />
              <HeaderCell label="CPL"    k="cpl"    />
              <HeaderCell label="CTR"    k="ctr"    />
              <HeaderCell label="ROAS"   k="roas"   />
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700/30">
            {sorted.map((c) => (
              <tr key={c.campaign_id} className="hover:bg-navy-700/30 transition-colors">
                <td className="px-4 py-3 text-white text-xs font-medium max-w-[200px] truncate">{c.campaign_name}</td>
                <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                  R$ {c.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-gray-300 text-xs">{c.leads}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap font-medium"
                  style={{ color: c.cpl <= avgCpl ? '#10B981' : '#EF4444' }}>
                  R$ {c.cpl.toFixed(2).replace('.', ',')}
                </td>
                <td className="px-4 py-3 text-gray-300 text-xs">{c.ctr.toFixed(2)}%</td>
                <td className="px-4 py-3 text-gray-300 text-xs">{c.roas.toFixed(2)}x</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border
                    ${c.status === 'ativo'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
                    {c.status === 'ativo' ? 'Ativo' : 'Pausado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-navy-700/50 bg-navy-700/20">
              <td className="px-4 py-3 text-xs font-semibold text-gray-400">Total</td>
              <td className="px-4 py-3 text-xs font-semibold text-gold whitespace-nowrap">
                R$ {totals.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-xs font-semibold text-white">{totals.leads}</td>
              <td className="px-4 py-3 text-xs font-semibold text-white">
                R$ {(totals.spend / (totals.leads || 1)).toFixed(2).replace('.', ',')}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MetaAdsPage() {
  const [days, setDays]             = useState(30);
  const [overview, setOverview]     = useState(null);
  const [timeline, setTimeline]     = useState([]);
  const [campaigns, setCampaigns]   = useState([]);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [syncing, setSyncing]       = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [connected, setConnected]   = useState(true); // true = show data (mock)
  const [lastSync, setLastSync]     = useState(null);
  const [syncOk, setSyncOk]         = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, tl, cm, cp] = await Promise.all([
        getMetaAdsOverview(days),
        getMetaAdsTimeline(days),
        getMetaAdsCampaigns(days),
        getMetaAdsComparison(days),
      ]);
      setOverview(ov);
      if (ov.lastSync) {
        const ls = new Date(ov.lastSync);
        setLastSync(ls);
        setSyncOk(Date.now() - ls.getTime() < 30 * 60 * 1000);
      }
      setTimeline(tl);
      setCampaigns(cm);
      setComparison(cp);
    } catch { /* keep stale data */ }
    finally { setLoading(false); }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncMetaAds();
      await load();
    } finally { setSyncing(false); }
  };

  const fmtBRL  = (v) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  // Slimmed timeline for chart labels
  const tlChart = timeline.filter((_, i) => days <= 15 || i % 3 === 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-semibold text-base">Meta Ads Dashboard</h2>
          <p className="text-gray-500 text-xs mt-0.5">Performance em tempo real — sincronizado a cada 30 minutos</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Last sync badge */}
          {lastSync && (
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border
              ${syncOk
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'}`}>
              Sync: {lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-navy-800 border border-navy-700/50 rounded-xl p-1">
            {PERIODS.map((p) => (
              <button key={p.days} onClick={() => setDays(p.days)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                  ${days === p.days ? 'bg-gold/15 text-gold' : 'text-gray-500 hover:text-gray-300'}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Sync button */}
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-navy-800 border border-navy-700/50 text-gray-400 hover:text-white hover:border-navy-600 transition-all disabled:opacity-50">
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Sincronizando…' : 'Sincronizar'}
          </button>

          {/* Connect button */}
          {!connected && (
            <button onClick={() => setShowConnect(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-light text-navy-900 transition-colors">
              <BarChart2 size={12} /> Conectar Meta Ads
            </button>
          )}
        </div>
      </div>

      {/* ── Not connected state ── */}
      {!connected && (
        <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
            <BarChart2 size={24} className="text-gold" />
          </div>
          <h3 className="text-white font-semibold text-sm mb-1">Conecte sua conta Meta Ads</h3>
          <p className="text-gray-500 text-xs max-w-xs mb-5">
            Visualize gasto, leads, CPL, CTR e ROAS diretamente no CRM — sincronizado automaticamente.
          </p>
          <button onClick={() => setShowConnect(true)}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gold hover:bg-gold-light text-navy-900 transition-colors">
            Conectar conta Meta Ads
          </button>
        </div>
      )}

      {connected && (
        <>
          {/* ── Row 1: 6 metric cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard loading={loading} icon={DollarSign} label="Gasto total"     color="#EF4444"
              value={overview ? fmtBRL(overview.spend) : '—'}
              sub="investido no período" />
            <MetricCard loading={loading} icon={Users}       label="Leads gerados"  color="#3B82F6"
              value={overview?.leads ?? '—'}
              sub="via Meta Ads" />
            <MetricCard loading={loading} icon={Target}      label="CPL"            color="#C9A84C"
              value={overview ? fmtBRL(overview.cpl) : '—'}
              sub="custo por lead" />
            <MetricCard loading={loading} icon={MousePointer} label="CTR"           color="#10B981"
              value={overview ? `${overview.ctr.toFixed(2)}%` : '—'}
              sub="taxa de clique" />
            <MetricCard loading={loading} icon={TrendingUp}  label="ROAS"           color="#10B981"
              value={overview ? `${overview.roas.toFixed(2)}x` : '—'}
              sub="retorno sobre gasto" />
            <MetricCard loading={loading} icon={Eye}         label="Alcance"        color="#8B5CF6"
              value={overview ? overview.reach.toLocaleString('pt-BR') : '—'}
              sub="pessoas alcançadas" />
          </div>

          {/* ── Row 2: Charts ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Gasto vs Leads */}
            <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Investimento e Leads — dia a dia</h3>
              {loading ? <Skeleton className="h-52" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={tlChart}>
                    <defs>
                      <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left"  tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={(v, n) => n === 'Gasto' ? fmtBRL(v) : v} />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
                    <Area yAxisId="left"  type="monotone" dataKey="spend" name="Gasto" stroke="#EF4444" strokeWidth={2} fill="url(#gSpend)" dot={false} />
                    <Area yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#C9A84C" strokeWidth={2} fill="url(#gLeads)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Meta vs CRM comparison */}
            <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Do Anúncio ao Agendamento</h3>
              {loading ? <Skeleton className="h-52" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comparison.filter((_, i) => i % 2 === 0)} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
                    <Bar dataKey="meta_leads" name="Meta Leads"  fill="#3B82F6" radius={[2,2,0,0]} maxBarSize={16} />
                    <Bar dataKey="agendados"  name="Agendados"   fill="#C9A84C" radius={[2,2,0,0]} maxBarSize={16} />
                    <Bar dataKey="realizados" name="Realizados"  fill="#10B981" radius={[2,2,0,0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Row 3: Campaigns table ── */}
          <CampaignsTable campaigns={campaigns} loading={loading} />
        </>
      )}

      {showConnect && (
        <ConnectModal
          onClose={() => setShowConnect(false)}
          onConnected={(info) => {
            setConnected(true);
            setShowConnect(false);
            load();
          }}
        />
      )}
    </div>
  );
}

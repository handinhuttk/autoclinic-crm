import { useState } from 'react';
import { BarChart2, CheckCircle2, AlertCircle, ChevronDown, Loader2, ExternalLink } from 'lucide-react';
import { getMetaAdsAccounts, connectMetaAds, disconnectMeta } from '../../services/api';

function StatusPill({ connected }) {
  return connected
    ? <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Conectado</span>
    : <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 border border-gray-600/30"><span className="w-1.5 h-1.5 rounded-full bg-gray-500" />Desconectado</span>;
}

export default function MetaAdsConnector({ status, onStatusChange }) {
  const [view, setView]             = useState('idle'); // idle | wizard | confirm-disconnect
  const [step, setStep]             = useState(1);      // 1=token, 2=select account
  const [token, setToken]           = useState('');
  const [accounts, setAccounts]     = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const connected  = status?.connected ?? false;
  const accountId  = status?.adAccountId;

  async function handleFetchAccounts() {
    if (!token.trim()) return;
    setLoading(true); setError('');
    try {
      const list = await getMetaAdsAccounts(token.trim());
      if (!list.length) { setError('Nenhuma conta de anúncio encontrada para esse token.'); return; }
      setAccounts(list);
      setSelectedId(list[0].id);
      setStep(2);
    } catch (e) {
      setError(e.message || 'Erro ao buscar contas.');
    } finally { setLoading(false); }
  }

  async function handleConnect() {
    if (!selectedId) return;
    setLoading(true); setError('');
    try {
      await connectMetaAds({ accessToken: token.trim(), adAccountId: selectedId });
      setView('idle'); setStep(1); setToken(''); setAccounts([]);
      onStatusChange();
    } catch (e) {
      setError(e.message || 'Erro ao conectar.');
    } finally { setLoading(false); }
  }

  async function handleDisconnect() {
    setLoading(true);
    try { await disconnectMeta(); onStatusChange(); }
    catch { /* ignore */ }
    finally { setLoading(false); setView('idle'); }
  }

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart2 size={17} className="text-blue-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Meta Ads</p>
            <p className="text-gray-500 text-[11px]">Facebook & Instagram Ads</p>
          </div>
        </div>
        <StatusPill connected={connected} />
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Conectado */}
        {connected && view !== 'confirm-disconnect' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              Conta ID: <span className="text-white font-mono">{accountId}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setView('wizard'); setStep(1); setError(''); }}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              >Reconectar</button>
              <button
                onClick={() => setView('confirm-disconnect')}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >Desconectar</button>
            </div>
          </div>
        )}

        {/* Confirmação desconectar */}
        {view === 'confirm-disconnect' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">Isso desconectará o Meta Ads e parará o sync automático de dados.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('idle')} className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-navy-700/80 text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleDisconnect} disabled={loading} className="flex-1 px-3 py-2 text-xs font-medium rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {loading ? 'Desconectando…' : 'Sim, desconectar'}
              </button>
            </div>
          </div>
        )}

        {/* Desconectado / Wizard */}
        {(!connected || view === 'wizard') && view !== 'confirm-disconnect' && (
          <div className="space-y-4">
            {/* Step 1: Token */}
            <div className="space-y-2">
              <label className="text-gray-400 text-[11px] uppercase tracking-wider">Token de Acesso</label>
              <input
                type="text"
                value={token}
                onChange={(e) => { setToken(e.target.value); setStep(1); setAccounts([]); setError(''); }}
                placeholder="EAAxxxxxxxxxx..."
                className="w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
              />
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink size={11} />Abrir API Explorer do Meta
              </a>
            </div>

            {/* Step 2: Select account */}
            {step === 2 && accounts.length > 0 && (
              <div className="space-y-2">
                <label className="text-gray-400 text-[11px] uppercase tracking-wider">Conta de Anúncio</label>
                <div className="relative">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full appearance-none bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold/40 transition-colors pr-8"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.currency})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={13} className="shrink-0" />{error}
              </div>
            )}

            {step === 1 ? (
              <button
                onClick={handleFetchAccounts}
                disabled={!token.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gold text-navy-900 hover:bg-gold-light transition-colors disabled:opacity-40"
              >
                {loading ? <><Loader2 size={13} className="animate-spin" />Buscando contas…</> : 'Buscar Contas'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-3 py-2.5 text-xs rounded-xl border border-navy-700/80 text-gray-400 hover:text-white transition-colors">Voltar</button>
                <button
                  onClick={handleConnect}
                  disabled={!selectedId || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gold text-navy-900 hover:bg-gold-light transition-colors disabled:opacity-40"
                >
                  {loading ? <><Loader2 size={13} className="animate-spin" />Conectando…</> : 'Conectar'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

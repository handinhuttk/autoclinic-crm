import { useState } from 'react';
import { MessageCircle, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import { connectWhatsApp, disconnectWhatsApp } from '../../services/api';

function StatusPill({ connected }) {
  return connected
    ? <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Conectado</span>
    : <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 border border-gray-600/30"><span className="w-1.5 h-1.5 rounded-full bg-gray-500" />Desconectado</span>;
}

export default function WhatsAppConnector({ status, onStatusChange }) {
  const [view, setView]           = useState('idle'); // idle | form | confirm-disconnect
  const [instanceId, setInstanceId] = useState('');
  const [token, setToken]         = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const connected   = status?.connected ?? false;
  const instanceMasked = status?.instanceId
    ? '...' + status.instanceId.slice(-6)
    : null;
  const connectedAt = status?.connectedAt
    ? new Date(status.connectedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')
    : null;

  async function handleConnect() {
    if (!instanceId.trim() || !token.trim()) return;
    setLoading(true); setError('');
    try {
      await connectWhatsApp({ instanceId: instanceId.trim(), token: token.trim() });
      setView('idle'); setInstanceId(''); setToken('');
      onStatusChange();
    } catch (e) {
      setError(e.message || 'Credenciais inválidas. Verifique o Instance ID e o token.');
    } finally { setLoading(false); }
  }

  async function handleDisconnect() {
    setLoading(true);
    try { await disconnectWhatsApp(); onStatusChange(); }
    catch { /* ignore */ }
    finally { setLoading(false); setView('idle'); }
  }

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center">
            <MessageCircle size={17} className="text-[#25D366]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">WhatsApp</p>
            <p className="text-gray-500 text-[11px]">Z-API — Envio de mensagens</p>
          </div>
        </div>
        <StatusPill connected={connected} />
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Conectado */}
        {connected && view !== 'confirm-disconnect' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                Instance: <span className="text-white font-mono">{instanceMasked}</span>
              </div>
              {connectedAt && (
                <p className="text-gray-600 text-[11px] pl-5">Conectado em {connectedAt}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setView('form'); setError(''); }}
                className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              >Editar credenciais</button>
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
              <p className="text-red-400 text-xs">Isso removerá as credenciais Z-API do sistema.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('idle')} className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-navy-700/80 text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleDisconnect} disabled={loading} className="flex-1 px-3 py-2 text-xs font-medium rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {loading ? 'Removendo…' : 'Sim, desconectar'}
              </button>
            </div>
          </div>
        )}

        {/* Desconectado / Form */}
        {(!connected || view === 'form') && view !== 'confirm-disconnect' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-400 text-[11px] uppercase tracking-wider">Instance ID</label>
              <input
                type="text"
                value={instanceId}
                onChange={(e) => { setInstanceId(e.target.value); setError(''); }}
                placeholder="ex: 3D91A5CB..."
                className="w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-[11px] uppercase tracking-wider">Token</label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setError(''); }}
                  placeholder="Token da instância Z-API"
                  className="w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2.5 pr-10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showToken ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <a
                href="https://developer.z-api.io/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#25D366] hover:opacity-80 transition-opacity"
              >
                <ExternalLink size={11} />Onde encontro esses dados?
              </a>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={13} className="shrink-0" />{error}
              </div>
            )}

            <div className="flex gap-2">
              {view === 'form' && (
                <button onClick={() => setView('idle')} className="px-3 py-2.5 text-xs rounded-xl border border-navy-700/80 text-gray-400 hover:text-white transition-colors">Cancelar</button>
              )}
              <button
                onClick={handleConnect}
                disabled={!instanceId.trim() || !token.trim() || loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gold text-navy-900 hover:bg-gold-light transition-colors disabled:opacity-40"
              >
                {loading
                  ? <><Loader2 size={13} className="animate-spin" />Testando conexão…</>
                  : 'Testar e Conectar'
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

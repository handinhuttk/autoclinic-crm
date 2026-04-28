import { useState } from 'react';
import { X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { KANBAN_COLUMNS } from '../../data/mockData';
import { useLeads } from '../../context/LeadsContext';

const ORIGENS = ['WhatsApp', 'Instagram', 'Google', 'Indicação', 'Facebook', 'Outro'];

const inputCls =
  'w-full bg-navy-900/60 border border-navy-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors';

function Field({ label, children }) {
  return (
    <div>
      <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function toFormState(lead) {
  return {
    name:        lead.name,
    phone:       lead.phone,
    email:       lead.email,
    exame:       lead.exame,
    convenio:    lead.convenio,
    origem:      lead.origem,
    valor:       lead.valor,
    agendamento: lead.agendamento ? lead.agendamento.slice(0, 16) : '',
    stage:       lead.stage,
  };
}

export default function LeadModal({ lead, onClose }) {
  const { saveLead } = useLeads();
  const [form, setForm]   = useState(() => toFormState(lead));
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setStage = (stage) => setForm((f) => ({ ...f, stage }));

  const original = toFormState(lead);
  const dirty = JSON.stringify(form) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    await saveLead(lead.id, {
      ...form,
      status:      form.stage,
      valor:       parseFloat(form.valor) || 0,
      agendamento: form.agendamento ? new Date(form.agendamento).toISOString() : null,
      avatar:      form.name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase(),
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-800 border border-navy-700/60 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
          <div className="flex items-center gap-3">
            <Avatar initials={lead.avatar} size="lg" />
            <div>
              <h2 className="text-white font-semibold text-sm">{lead.name}</h2>
              <Badge status={lead.status} className="mt-0.5" />
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[62vh] overflow-y-auto scrollbar-thin">
          <Field label="Nome completo">
            <input value={form.name} onChange={set('name')} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefone">
              <input value={form.phone} onChange={set('phone')} className={inputCls} />
            </Field>
            <Field label="E-mail">
              <input value={form.email} onChange={set('email')} type="email" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Exame">
              <input value={form.exame} onChange={set('exame')} className={inputCls} />
            </Field>
            <Field label="Convênio">
              <input value={form.convenio} onChange={set('convenio')} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Origem">
              <select value={form.origem} onChange={set('origem')} className={inputCls}>
                {ORIGENS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Valor (R$)">
              <input value={form.valor} onChange={set('valor')} type="number" step="0.01" min="0" className={inputCls} />
            </Field>
          </div>

          <Field label="Data do agendamento">
            <input value={form.agendamento} onChange={set('agendamento')} type="datetime-local" className={inputCls} />
          </Field>

          {/* Stage */}
          <div>
            <p className="text-gray-500 text-[10px] mb-2 uppercase tracking-wide">Estágio no pipeline</p>
            <div className="grid grid-cols-3 gap-1.5">
              {KANBAN_COLUMNS.map((col) => (
                <button key={col.id} onClick={() => setStage(col.id)}
                  className={`text-[11px] px-2 py-1.5 rounded-lg border transition-all text-center font-medium
                    ${form.stage === col.id ? 'border-current' : 'border-navy-700/50 text-gray-500 hover:border-navy-600'}`}
                  style={form.stage === col.id
                    ? { color: col.color, borderColor: col.color, background: `${col.color}18` }
                    : {}}>
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 border-t border-navy-700/50">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm text-gray-400 border border-navy-700/60 hover:border-navy-600 hover:text-white transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !dirty}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-navy-900 bg-gold hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

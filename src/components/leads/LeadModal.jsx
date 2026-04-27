import { X, Phone, Mail, Calendar, Building2, FlaskConical, Globe } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { KANBAN_COLUMNS } from '../../data/mockData';
import { updateLead } from '../../services/api';
import { useState } from 'react';

export default function LeadModal({ lead, onClose, onUpdate }) {
  const [stage, setStage] = useState(lead.stage);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await updateLead(lead.id, { stage, status: stage });
    onUpdate(updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-800 border border-navy-700/60 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
          <div className="flex items-center gap-3">
            <Avatar initials={lead.avatar} size="lg" />
            <div>
              <h2 className="text-white font-semibold text-sm">{lead.name}</h2>
              <Badge status={lead.status} className="mt-0.5" />
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <InfoRow icon={Phone} label="Telefone" value={lead.phone.replace(/^55/, '+55 ').replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')} />
          <InfoRow icon={Mail} label="E-mail" value={lead.email} />
          <InfoRow icon={FlaskConical} label="Exame" value={lead.exame} />
          <InfoRow icon={Building2} label="Convênio" value={lead.convenio} />
          <InfoRow icon={Globe} label="Origem" value={lead.origem} />
          {lead.agendamento && (
            <InfoRow icon={Calendar} label="Agendamento"
              value={format(new Date(lead.agendamento), "dd 'de' MMMM 'às' HH'h'mm", { locale: ptBR })} />
          )}
          <div className="pt-1">
            <p className="text-gray-500 text-xs mb-1.5">Valor</p>
            <p className="text-gold font-bold text-lg">R$ {lead.valor.toFixed(2).replace('.', ',')}</p>
          </div>

          {/* Stage selector */}
          <div className="pt-2">
            <p className="text-gray-500 text-xs mb-2">Mover para estágio</p>
            <div className="grid grid-cols-3 gap-1.5">
              {KANBAN_COLUMNS.map((col) => (
                <button key={col.id} onClick={() => setStage(col.id)}
                  className={`text-[11px] px-2 py-1.5 rounded-lg border transition-all text-center font-medium
                    ${stage === col.id ? 'border-current' : 'border-navy-700/50 text-gray-500 hover:border-navy-600'}`}
                  style={stage === col.id ? { color: col.color, borderColor: col.color, background: `${col.color}18` } : {}}>
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 border-t border-navy-700/50">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-gray-400 border border-navy-700/60 hover:border-navy-600 hover:text-white transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || stage === lead.stage}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-navy-900 bg-gold hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-navy-700/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-gray-400" />
      </div>
      <div>
        <p className="text-gray-500 text-[10px] leading-none mb-0.5">{label}</p>
        <p className="text-gray-200 text-xs">{value}</p>
      </div>
    </div>
  );
}

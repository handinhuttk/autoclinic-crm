import { useLocation } from 'react-router';
import { Bell, Search, Bot, Calendar, UserPlus, CheckCircle2, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import StatusDot from '../ui/StatusDot';
import { useLeads } from '../../context/LeadsContext';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PAGE_TITLES = {
  '/':       { title: 'Dashboard',  subtitle: 'Visão geral da operação' },
  '/kanban': { title: 'Kanban',     subtitle: 'Pipeline de atendimento' },
  '/leads':  { title: 'Leads',      subtitle: 'Gestão de pacientes' },
};

const NOTIF_ICONS = {
  novo:      { Icon: UserPlus,    color: '#3B82F6' },
  agendado:  { Icon: Calendar,    color: '#F59E0B' },
  confirmado:{ Icon: CheckCircle2,color: '#10B981' },
};

function buildNotifications(leads) {
  const notifs = [];
  leads.forEach((l) => {
    const created = new Date(l.createdAt);
    if (isToday(created) && l.status === 'novo') {
      notifs.push({
        id: `new-${l.id}`,
        type: 'novo',
        title: 'Novo lead recebido',
        body: l.name,
        meta: `via ${l.origem}`,
        time: created,
      });
    }
    if (l.agendamento) {
      const appt = new Date(l.agendamento);
      if (isToday(appt)) {
        notifs.push({
          id: `appt-${l.id}`,
          type: 'agendado',
          title: 'Agendamento hoje',
          body: l.name,
          meta: format(appt, "HH'h'mm", { locale: ptBR }) + ' — ' + l.exame,
          time: appt,
        });
      } else if (isTomorrow(appt)) {
        notifs.push({
          id: `tomorrow-${l.id}`,
          type: 'confirmado',
          title: 'Agendamento amanhã',
          body: l.name,
          meta: format(appt, "HH'h'mm", { locale: ptBR }) + ' — ' + l.exame,
          time: appt,
        });
      }
    }
  });
  return notifs.sort((a, b) => b.time - a.time);
}

export default function Header() {
  const { pathname }     = useLocation();
  const { leads }        = useLeads();
  const info             = PAGE_TITLES[pathname] ?? { title: 'AutoClinic', subtitle: '' };

  const [open, setOpen]           = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const panelRef                  = useRef(null);

  const notifications = useMemo(() => buildNotifications(leads), [leads]);
  const visible       = notifications.filter((n) => !dismissed.has(n.id));
  const unread        = visible.length;

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const dismiss    = (id) => setDismissed((s) => new Set([...s, id]));
  const dismissAll = () => setDismissed(new Set(notifications.map((n) => n.id)));

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-white font-semibold text-base leading-none">{info.title}</h1>
        <p className="text-gray-500 text-xs mt-0.5">{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Isis status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800 border border-navy-700/60 text-xs text-gray-400">
          <Bot size={13} className="text-gold" />
          <span>Isis</span>
          <StatusDot status="realizado" pulse />
          <span className="text-emerald-400 font-medium">Online</span>
        </div>

        {/* Search */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-gold text-navy-900 text-[9px] font-bold px-1">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-80 z-50 bg-navy-800 border border-navy-700/60 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700/40">
                <div className="flex items-center gap-2">
                  <Bell size={13} className="text-gold" />
                  <span className="text-white text-xs font-semibold">Notificações</span>
                  {unread > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold font-medium">
                      {unread}
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button onClick={dismissAll} className="text-[10px] text-gray-500 hover:text-gold transition-colors">
                    Marcar tudo como lido
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-navy-700/30">
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CheckCircle2 size={24} className="text-gray-700 mb-2" />
                    <p className="text-gray-600 text-xs">Tudo em dia!</p>
                  </div>
                ) : (
                  visible.map((n) => {
                    const { Icon, color } = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.novo;
                    return (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-navy-700/30 transition-colors group">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${color}18` }}>
                          <Icon size={13} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-400 text-[10px]">{n.title}</p>
                          <p className="text-white text-xs font-medium truncate">{n.body}</p>
                          <p className="text-gray-600 text-[10px] truncate">{n.meta}</p>
                        </div>
                        <button
                          onClick={() => dismiss(n.id)}
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-700 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all mt-0.5"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy-900 text-xs font-bold cursor-pointer">
          AC
        </div>
      </div>
    </header>
  );
}

import { useLocation } from 'react-router';
import { Bell, Search, Bot } from 'lucide-react';
import StatusDot from '../ui/StatusDot';

const PAGE_TITLES = {
  '/':       { title: 'Dashboard', subtitle: 'Visão geral da operação' },
  '/kanban': { title: 'Kanban', subtitle: 'Pipeline de atendimento' },
  '/leads':  { title: 'Leads', subtitle: 'Gestão de pacientes' },
};

export default function Header() {
  const { pathname } = useLocation();
  const info = PAGE_TITLES[pathname] ?? { title: 'AutoClinic', subtitle: '' };

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
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-navy-700/60 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy-900 text-xs font-bold cursor-pointer">
          AC
        </div>
      </div>
    </header>
  );
}

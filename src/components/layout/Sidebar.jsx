import { NavLink } from 'react-router';
import { LayoutDashboard, KanbanSquare, Users, BarChart2, ChevronLeft, ChevronRight, Bot } from 'lucide-react';

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/kanban',  icon: KanbanSquare,    label: 'Kanban'     },
  { to: '/leads',   icon: Users,           label: 'Leads'      },
  { to: '/metaads', icon: BarChart2,       label: 'Meta Ads'   },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className="relative flex flex-col h-full bg-navy-900 border-r border-navy-700/50 transition-all duration-300"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-700/50 overflow-hidden shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shrink-0">
          <Bot size={16} className="text-navy-900" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white whitespace-nowrap tracking-tight">AutoClinic</p>
            <p className="text-[10px] text-gold whitespace-nowrap font-medium tracking-widest uppercase">CRM</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
              ${isActive
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-gray-400 hover:text-white hover:bg-navy-700/50'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-navy-800 border border-navy-700/80 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-navy-700/50">
          <p className="text-[10px] text-gray-600 text-center">AutoClinic AI © 2026</p>
        </div>
      )}
    </aside>
  );
}

import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import LeadModal from './LeadModal';
import { SkeletonRow } from '../ui/Skeleton';
import { KANBAN_COLUMNS } from '../../data/mockData';

const PAGE_SIZE = 10;

export default function LeadsTable({ leads, loading, onUpdate }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.exame.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
      const matchStatus = filterStatus === 'all' || l.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [leads, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (s) => { setFilterStatus(s); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={handleSearch} placeholder="Buscar por nome, exame ou telefone…"
            className="w-full bg-navy-800 border border-navy-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all
              ${filterStatus === 'all' ? 'bg-gold/10 text-gold border-gold/30' : 'text-gray-500 border-navy-700/60 hover:border-navy-600 hover:text-gray-300'}`}>
            <SlidersHorizontal size={12} /> Todos
          </button>
          {KANBAN_COLUMNS.map((col) => (
            <button key={col.id} onClick={() => handleFilter(col.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all
                ${filterStatus === col.id ? 'border-current' : 'text-gray-500 border-navy-700/60 hover:border-navy-600 hover:text-gray-300'}`}
              style={filterStatus === col.id ? { color: col.color, borderColor: col.color, background: `${col.color}18` } : {}}>
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700/50">
                {['Paciente', 'Exame', 'Convênio', 'Origem', 'Valor', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30">
              {loading
                ? [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)
                : paginated.map((lead) => (
                    <tr key={lead.id} onClick={() => setSelectedLead(lead)}
                      className="hover:bg-navy-700/30 cursor-pointer transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={lead.avatar} size="sm" />
                          <div>
                            <p className="text-white text-xs font-medium group-hover:text-gold transition-colors">{lead.name}</p>
                            <p className="text-gray-600 text-[10px]">{lead.phone.replace(/^55/, '+55 ').replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{lead.exame}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{lead.convenio}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{lead.origem}</td>
                      <td className="px-4 py-3 text-gold text-xs font-semibold whitespace-nowrap">
                        R$ {lead.valor.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-4 py-3"><Badge status={lead.status} /></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-700/40">
            <p className="text-gray-600 text-xs">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              {filterStatus !== 'all' || search ? ` (filtrado de ${leads.length})` : ''}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                    ${page === i + 1 ? 'bg-gold/15 text-gold' : 'text-gray-500 hover:text-white hover:bg-navy-700/60'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-navy-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)}
          onUpdate={(updated) => { onUpdate(updated); setSelectedLead(null); }} />
      )}
    </>
  );
}

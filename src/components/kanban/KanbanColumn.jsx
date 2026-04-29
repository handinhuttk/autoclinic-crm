import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

export default function KanbanColumn({ column, leads, onCardClick }) {
  const total = leads.reduce((sum, l) => sum + l.valor, 0);

  return (
    <div className="flex flex-col w-64 shrink-0 bg-navy-800/60 border border-navy-700/40 rounded-2xl">
      {/* Column Header */}
      <div className="px-3.5 py-3 border-b border-navy-700/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: column.color }} />
            <span className="text-white text-xs font-semibold">{column.label}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-navy-700/80 text-gray-400 font-medium">
            {leads.length}
          </span>
        </div>
        <p className="text-[10px] text-gray-600 pl-4">
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2.5 space-y-2.5 min-h-[120px] overflow-y-auto transition-colors
              ${snapshot.isDraggingOver ? 'bg-navy-700/30' : ''}`}
          >
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

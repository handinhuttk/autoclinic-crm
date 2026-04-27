import { Draggable } from '@hello-pangea/dnd';
import { Phone, Calendar, GripVertical } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function LeadCard({ lead, index, onClick }) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={() => onClick(lead)}
          className={`group bg-navy-800 border rounded-xl p-3.5 cursor-pointer select-none transition-all duration-150
            ${snapshot.isDragging
              ? 'border-gold/40 shadow-xl shadow-black/40 rotate-1 scale-105'
              : 'border-navy-700/50 hover:border-navy-600/80 hover:shadow-lg hover:shadow-black/20'
            }`}
        >
          <div className="flex items-start gap-2">
            <div {...provided.dragHandleProps} className="mt-0.5 text-gray-600 hover:text-gray-400 transition-colors cursor-grab active:cursor-grabbing">
              <GripVertical size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Avatar initials={lead.avatar} size="sm" />
                <p className="text-white text-xs font-semibold truncate">{lead.name}</p>
              </div>
              <p className="text-gray-500 text-[11px] truncate mb-2">{lead.exame}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-700/60 text-gray-500 truncate max-w-[70px]">
                  {lead.convenio}
                </span>
                <span className="text-gold text-xs font-semibold shrink-0">
                  R$ {lead.valor.toFixed(2).replace('.', ',')}
                </span>
              </div>
              {lead.agendamento && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-600">
                  <Calendar size={10} />
                  {format(new Date(lead.agendamento), "dd/MM — HH'h'mm", { locale: ptBR })}
                </div>
              )}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600">
                <Phone size={10} />
                {lead.phone.replace(/^55/, '+55 ').replace(/(\d{2})(\d{5})(\d{4})$/, '$1 $2-$3')}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

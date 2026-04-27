import { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import LeadModal from '../leads/LeadModal';
import Skeleton from '../ui/Skeleton';
import { getLeads, updateLeadStage } from '../../services/api';
import { KANBAN_COLUMNS } from '../../data/mockData';

export default function KanbanBoard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const onDragEnd = useCallback(async ({ source, destination, draggableId }) => {
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const newStage = destination.droppableId;
    setLeads((prev) => prev.map((l) => l.id === draggableId ? { ...l, stage: newStage, status: newStage } : l));
    await updateLeadStage(draggableId, newStage);
  }, []);

  const grouped = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col.id] = leads.filter((l) => l.stage === col.id);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="w-64 shrink-0 space-y-2.5">
            <Skeleton className="h-14 w-full rounded-2xl" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-160px)]">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              leads={grouped[col.id] ?? []}
              onCardClick={setSelectedLead}
            />
          ))}
        </div>
      </DragDropContext>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updated) => {
            setLeads((prev) => prev.map((l) => l.id === updated.id ? updated : l));
            setSelectedLead(null);
          }}
        />
      )}
    </>
  );
}

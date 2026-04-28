import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLeads, updateLeadStage, updateLead } from '../services/api';

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const moveLead = useCallback(async (id, newStage) => {
    setLeads((prev) =>
      prev.map((l) => l.id === id ? { ...l, stage: newStage, status: newStage } : l)
    );
    await updateLeadStage(id, newStage);
  }, []);

  const saveLead = useCallback(async (id, patch) => {
    const updated = await updateLead(id, patch);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...updated } : l));
    return updated;
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, loading, moveLead, saveLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export const useLeads = () => useContext(LeadsContext);

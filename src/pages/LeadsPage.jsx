import { useState, useEffect } from 'react';
import LeadsTable from '../components/leads/LeadsTable';
import { getLeads } from '../services/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads().then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const handleUpdate = (updated) => {
    setLeads((prev) => prev.map((l) => l.id === updated.id ? updated : l));
  };

  return <LeadsTable leads={leads} loading={loading} onUpdate={handleUpdate} />;
}

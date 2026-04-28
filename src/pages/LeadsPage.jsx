import LeadsTable from '../components/leads/LeadsTable';
import { useLeads } from '../context/LeadsContext';

export default function LeadsPage() {
  const { leads, loading } = useLeads();
  return <LeadsTable leads={leads} loading={loading} />;
}

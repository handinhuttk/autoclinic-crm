import { useEffect, useState } from 'react';
import { getConnectorStatus } from '../services/api';
import MetaAdsConnector from '../components/settings/MetaAdsConnector';
import WhatsAppConnector from '../components/settings/WhatsAppConnector';

function ConnectorSkeleton() {
  return <div className="h-36 rounded-2xl bg-navy-800 border border-navy-700/50 animate-pulse" />;
}

export default function SettingsPage() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try { setStatus(await getConnectorStatus()); }
    catch { /* keep stale */ }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white font-semibold text-base">Configurações</h2>
        <p className="text-gray-500 text-xs mt-0.5">Gerencie as integrações do AutoClinic CRM</p>
      </div>

      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Conectores</p>
        <div className="space-y-4">
          {loading ? (
            <><ConnectorSkeleton /><ConnectorSkeleton /></>
          ) : (
            <>
              <WhatsAppConnector status={status?.whatsapp} onStatusChange={reload} />
              <MetaAdsConnector  status={status?.meta}     onStatusChange={reload} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

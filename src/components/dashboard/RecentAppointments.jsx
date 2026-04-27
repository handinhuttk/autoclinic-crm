import Badge from '../ui/Badge';
import Skeleton from '../ui/Skeleton';
import Avatar from '../ui/Avatar';

export default function RecentAppointments({ data, loading }) {
  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Próximos Agendamentos</h3>
          <p className="text-gray-500 text-xs mt-0.5">Consultas e exames confirmados</p>
        </div>
      </div>
      <div className="space-y-3">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))
          : data.map((appt) => (
              <div key={appt.id} className="flex items-center gap-3 py-2 border-b border-navy-700/30 last:border-0">
                <Avatar initials={appt.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{appt.name}</p>
                  <p className="text-gray-500 text-[11px] truncate">{appt.exame}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge status={appt.status} />
                  <span className="text-gray-600 text-[10px]">{appt.time}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

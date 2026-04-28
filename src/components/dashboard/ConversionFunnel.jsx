import { useState } from 'react';
import Skeleton from '../ui/Skeleton';

/* Dark-blue → vivid-accent gradient — darker = more leads (wider), brighter = fewer (narrower) */
const STAGE_COLORS  = ['#1E3A5F', '#1A4A6B', '#6B5A1E', '#9A7A2E', '#C9A84C'];
const STROKE_COLORS = ['#2A5A8F', '#2A6A9B', '#9B8A2E', '#CAA43E', '#E2B95A'];

const VW    = 1000;
const VH    = 180;
const CY    = VH / 2;
const MAX_H = VH * 0.90;
const MIN_H = VH * 0.07;

function calcHeight(leads, maxLeads) {
  return MIN_H + (leads / maxLeads) * (MAX_H - MIN_H);
}

function buildFlowPath(stages, slot) {
  const half = slot / 2;
  const N = stages.length;

  let top = `M 0,${stages[0].yT} L ${stages[0].cx},${stages[0].yT}`;
  for (let i = 0; i < N - 1; i++) {
    const { cx: x1, yT: y1 } = stages[i];
    const { cx: x2, yT: y2 } = stages[i + 1];
    top += ` C ${x1 + half},${y1} ${x2 - half},${y2} ${x2},${y2}`;
  }
  top += ` L ${VW},${stages[N - 1].yT}`;

  let bot = ` L ${VW},${stages[N - 1].yB} L ${stages[N - 1].cx},${stages[N - 1].yB}`;
  for (let i = N - 1; i > 0; i--) {
    const { cx: x2, yB: y2 } = stages[i];
    const { cx: x1, yB: y1 } = stages[i - 1];
    bot += ` C ${x2 - half},${y2} ${x1 + half},${y1} ${x1},${y1}`;
  }
  bot += ` L 0,${stages[0].yB} Z`;

  return top + bot;
}

export default function ConversionFunnel({ data, loading }) {
  const [hovered, setHovered] = useState(null);

  if (loading) return <Skeleton className="h-[276px] w-full rounded-2xl" />;
  if (!data?.length) return null;

  const N        = data.length;
  const slot     = VW / N;
  const maxLeads = data[0].leads;

  const stages = data.map((d, i) => {
    const cx       = (i + 0.5) * slot;
    const ht       = calcHeight(d.leads, maxLeads);
    const yT       = CY - ht / 2;
    const yB       = CY + ht / 2;
    const convPct  = i === 0 ? null : Math.round((d.leads / data[i - 1].leads) * 100);
    const totalPct = Math.round((d.leads / maxLeads) * 100);
    return { ...d, i, cx, ht, yT, yB, convPct, totalPct };
  });

  const flowPath = buildFlowPath(stages, slot);

  const gradStops = [
    { offset: '0%',    color: STAGE_COLORS[0] },
    ...stages.map((s) => ({
      offset: `${Math.round((s.cx / VW) * 100)}%`,
      color:  STAGE_COLORS[s.i] ?? STAGE_COLORS[STAGE_COLORS.length - 1],
    })),
    { offset: '100%', color: STAGE_COLORS[N - 1] ?? STAGE_COLORS[STAGE_COLORS.length - 1] },
  ];

  const dividerXs = Array.from({ length: N - 1 }, (_, i) => (i + 1) * slot);

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Funil de Conversão</h3>
          <p className="text-gray-500 text-xs mt-0.5">Jornada do lead até o atendimento</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 font-semibold">
          {stages[N - 1].totalPct}% taxa final
        </span>
      </div>

      {/* Stage labels */}
      <div className="flex mb-2">
        {stages.map((s) => (
          <div key={s.i} className="flex-1 text-center">
            <span
              className="text-[11px] font-medium tracking-wide uppercase transition-colors duration-150"
              style={{ color: hovered === s.i ? '#fff' : '#4B5563' }}
            >
              {s.stage}
            </span>
          </div>
        ))}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="cf-grad" x1="0" y1="0" x2={VW} y2="0" gradientUnits="userSpaceOnUse">
              {gradStops.map((gs, i) => (
                <stop key={i} offset={gs.offset} stopColor={gs.color} />
              ))}
            </linearGradient>
            <linearGradient id="cf-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.12" />
              <stop offset="100%" stopColor="white" stopOpacity="0"    />
            </linearGradient>
          </defs>

          <path d={flowPath} fill="url(#cf-grad)" />
          <path d={flowPath} fill="url(#cf-sheen)" style={{ pointerEvents: 'none' }} />

          {dividerXs.map((dx, i) => (
            <line key={i} x1={dx} y1={0} x2={dx} y2={VH}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="4 5" />
          ))}

          {stages.map((s) => (
            <rect key={s.i} x={s.i * slot} y={0} width={slot} height={VH}
              fill={hovered === s.i ? 'rgba(255,255,255,0.04)' : 'transparent'}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            />
          ))}

          {hovered !== null && (
            <line
              x1={stages[hovered].cx} y1={stages[hovered].yT + 6}
              x2={stages[hovered].cx} y2={stages[hovered].yB - 6}
              stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="3 4"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {stages.map((s) => {
            const hasConv = s.convPct !== null;
            const mainY   = hasConv ? CY - 14 : CY;
            return (
              <g key={s.i} style={{ pointerEvents: 'none' }}>
                <text x={s.cx} y={mainY} textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize="28" fontWeight="600"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', userSelect: 'none' }}>
                  {s.leads}
                </text>
                {hasConv && (
                  <text x={s.cx} y={CY + 20} textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.45)" fontSize="14"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', userSelect: 'none' }}>
                    {s.convPct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && (() => {
          const s       = stages[hovered];
          const leftPct = Math.min(Math.max((s.cx / VW) * 100, 11), 89);
          return (
            <div
              className="absolute z-20 pointer-events-none whitespace-nowrap"
              style={{ left: `${leftPct}%`, bottom: '100%', transform: 'translate(-50%, -8px)' }}
            >
              <div className="relative bg-navy-900 border border-navy-700/80 rounded-xl px-3.5 py-2.5 shadow-2xl text-xs">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45 bg-navy-900 border-r border-b border-navy-700/80" />
                <p className="font-semibold text-white mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ background: STAGE_COLORS[hovered] }} />
                  {s.stage}
                </p>
                <div className="space-y-1 text-gray-400">
                  <p>Leads: <span className="text-white font-semibold">{s.leads}</span></p>
                  {s.convPct !== null && (
                    <p>Da etapa anterior: <span className="text-gold font-semibold">{s.convPct}%</span></p>
                  )}
                  <p>Do total: <span className="text-white font-semibold">{s.totalPct}%</span></p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

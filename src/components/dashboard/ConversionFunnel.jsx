import { useState } from 'react';
import Skeleton from '../ui/Skeleton';

// Colors per stage index — navy blue → warm gold
const STAGE_COLORS = ['#1E3A5F', '#1A4A6B', '#6B5A1E', '#9A7A2E', '#C9A84C'];

// ─── SVG constants ────────────────────────────────────────────────────────────
const VW    = 1000;
const VH    = 180;
const CY    = VH / 2;         // vertical center line
const MAX_H = VH * 0.90;      // tallest possible shape (stage with 100% leads)
const MIN_H = VH * 0.07;      // minimum height so the shape never disappears

function calcHeight(leads, maxLeads) {
  return MIN_H + (leads / maxLeads) * (MAX_H - MIN_H);
}

/**
 * Build the single closed SVG path for the flow shape.
 *
 * Top edge:  M 0,yT[0]  → L cx[0],yT[0]  → S-curves through all cx[i] → L VW,yT[N-1]
 * Bottom:    L VW,yB[N-1]→ L cx[N-1],yB[N-1]→ S-curves back           → L 0,yB[0] Z
 *
 * Bezier handles sit exactly at each column boundary (cx[i] ± HALF), which
 * creates horizontal tangents at every column center — the organic S-curve look.
 */
function buildFlowPath(stages, slot) {
  const half = slot / 2;
  const N = stages.length;

  // Top edge (left → right)
  let top = `M 0,${stages[0].yT} L ${stages[0].cx},${stages[0].yT}`;
  for (let i = 0; i < N - 1; i++) {
    const { cx: x1, yT: y1 } = stages[i];
    const { cx: x2, yT: y2 } = stages[i + 1];
    top += ` C ${x1 + half},${y1} ${x2 - half},${y2} ${x2},${y2}`;
  }
  top += ` L ${VW},${stages[N - 1].yT}`;

  // Bottom edge (right → left) + close
  let bot = ` L ${VW},${stages[N - 1].yB} L ${stages[N - 1].cx},${stages[N - 1].yB}`;
  for (let i = N - 1; i > 0; i--) {
    const { cx: x2, yB: y2 } = stages[i];
    const { cx: x1, yB: y1 } = stages[i - 1];
    bot += ` C ${x2 - half},${y2} ${x1 + half},${y1} ${x1},${y1}`;
  }
  bot += ` L 0,${stages[0].yB} Z`;

  return top + bot;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ConversionFunnel({ data, loading }) {
  const [hovered, setHovered] = useState(null);

  if (loading) return <Skeleton className="h-[276px] w-full rounded-2xl" />;
  if (!data?.length) return null;

  const N         = data.length;
  const slot      = VW / N;
  const maxLeads  = data[0].leads;

  // Derive per-stage geometry
  const stages = data.map((d, i) => {
    const cx     = (i + 0.5) * slot;
    const ht     = calcHeight(d.leads, maxLeads);
    const yT     = CY - ht / 2;
    const yB     = CY + ht / 2;
    const convPct  = i === 0 ? null : Math.round((d.leads / data[i - 1].leads) * 100);
    const totalPct = Math.round((d.leads / maxLeads) * 100);
    return { ...d, i, cx, ht, yT, yB, convPct, totalPct };
  });

  const flowPath = buildFlowPath(stages, slot);

  // Gradient stops: one at each column center so each stage gets its exact color
  const gradStops = [
    { offset: '0%',    color: STAGE_COLORS[0] },
    ...stages.map((s) => ({
      offset: `${Math.round((s.cx / VW) * 100)}%`,
      color:  STAGE_COLORS[s.i] ?? STAGE_COLORS[STAGE_COLORS.length - 1],
    })),
    { offset: '100%', color: STAGE_COLORS[N - 1] ?? STAGE_COLORS[STAGE_COLORS.length - 1] },
  ];

  // Column dividers at each boundary between stages
  const dividerXs = Array.from({ length: N - 1 }, (_, i) => (i + 1) * slot);

  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Funil de Conversão</h3>
          <p className="text-gray-500 text-xs mt-0.5">Jornada do lead até o atendimento</p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 font-semibold">
          {stages[N - 1].totalPct}% taxa final
        </span>
      </div>

      {/* ── Stage labels (above SVG, aligned to columns) ── */}
      <div className="flex mb-2">
        {stages.map((s) => (
          <div key={s.i} className="flex-1 text-center">
            <span
              className="text-[11px] font-semibold tracking-wide uppercase transition-colors duration-150"
              style={{ color: hovered === s.i ? '#fff' : '#4B5563' }}
            >
              {s.stage}
            </span>
          </div>
        ))}
      </div>

      {/* ── SVG ── */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Horizontal gradient — column colors mapped to their center x positions */}
            <linearGradient
              id="cf-grad"
              x1="0" y1="0" x2={VW} y2="0"
              gradientUnits="userSpaceOnUse"
            >
              {gradStops.map((gs, i) => (
                <stop key={i} offset={gs.offset} stopColor={gs.color} />
              ))}
            </linearGradient>

            {/* Top-edge sheen: thin highlight strip along the top of the flow */}
            <linearGradient id="cf-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
              <stop offset="100%" stopColor="white" stopOpacity="0"    />
            </linearGradient>
          </defs>

          {/* ── Main flow shape ── */}
          <path d={flowPath} fill="url(#cf-grad)" />

          {/* ── Top-edge sheen overlay ── */}
          <path d={flowPath} fill="url(#cf-sheen)" style={{ pointerEvents: 'none' }} />

          {/* ── Column dividers ── */}
          {dividerXs.map((dx, i) => (
            <line
              key={i}
              x1={dx} y1={0} x2={dx} y2={VH}
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          ))}

          {/* ── Invisible hover zones (one rect per column) ── */}
          {stages.map((s) => (
            <rect
              key={s.i}
              x={s.i * slot} y={0}
              width={slot} height={VH}
              fill={hovered === s.i ? 'rgba(255,255,255,0.05)' : 'transparent'}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            />
          ))}

          {/* ── Hover center line ── */}
          {hovered !== null && (
            <line
              x1={stages[hovered].cx}
              y1={stages[hovered].yT + 6}
              x2={stages[hovered].cx}
              y2={stages[hovered].yB - 6}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1"
              strokeDasharray="3 4"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* ── Text inside the flow ── */}
          {stages.map((s) => {
            const hasConv = s.convPct !== null;
            // Vertically center the two-line group
            const mainY = hasConv ? CY - 14 : CY;
            return (
              <g key={s.i} style={{ pointerEvents: 'none' }}>
                {/* Lead count — large bold */}
                <text
                  x={s.cx} y={mainY}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize="28" fontWeight="700"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif', userSelect: 'none' }}
                >
                  {s.leads}
                </text>
                {/* Conversion % from previous stage — smaller, muted */}
                {hasConv && (
                  <text
                    x={s.cx} y={CY + 20}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.55)" fontSize="15"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', userSelect: 'none' }}
                  >
                    {s.convPct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ── Tooltip ── */}
        {hovered !== null && (() => {
          const s = stages[hovered];
          // Clamp so tooltip never clips the card edges
          const leftPct = Math.min(Math.max((s.cx / VW) * 100, 11), 89);
          return (
            <div
              className="absolute z-20 pointer-events-none whitespace-nowrap"
              style={{ left: `${leftPct}%`, bottom: '100%', transform: 'translate(-50%, -8px)' }}
            >
              <div className="relative bg-navy-900 border border-navy-700/80 rounded-xl px-3.5 py-2.5 shadow-2xl text-xs">
                {/* Caret */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45 bg-navy-900 border-r border-b border-navy-700/80" />
                <p className="font-semibold text-white mb-2 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ background: STAGE_COLORS[hovered] }}
                  />
                  {s.stage}
                </p>
                <div className="space-y-1 text-gray-400">
                  <p>Leads: <span className="text-white font-semibold">{s.leads}</span></p>
                  {s.convPct !== null && (
                    <p>
                      Da etapa anterior:{' '}
                      <span className="text-gold font-semibold">{s.convPct}%</span>
                    </p>
                  )}
                  <p>
                    Do total:{' '}
                    <span className="text-white font-semibold">{s.totalPct}%</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

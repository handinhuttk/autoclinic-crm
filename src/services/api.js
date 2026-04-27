import { LEADS, DASHBOARD_STATS, REVENUE_DATA, FUNNEL_DATA, ORIGEM_DATA, RECENT_APPOINTMENTS } from '../data/mockData';

const USE_MOCK = true;
const DELAY = 800;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeads() {
  if (USE_MOCK) {
    await delay(DELAY);
    return [...LEADS];
  }
  const res = await fetch('/api/leads');
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
}

export async function getLead(id) {
  if (USE_MOCK) {
    await delay(300);
    return LEADS.find((l) => l.id === id) ?? null;
  }
  const res = await fetch(`/api/leads/${id}`);
  if (!res.ok) throw new Error('Failed to fetch lead');
  return res.json();
}

export async function updateLeadStage(id, stage) {
  if (USE_MOCK) {
    await delay(200);
    return { id, stage, updatedAt: new Date().toISOString() };
  }
  const res = await fetch(`/api/leads/${id}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error('Failed to update stage');
  return res.json();
}

export async function updateLead(id, data) {
  if (USE_MOCK) {
    await delay(300);
    return { ...LEADS.find((l) => l.id === id), ...data, updatedAt: new Date().toISOString() };
  }
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update lead');
  return res.json();
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  if (USE_MOCK) {
    await delay(DELAY);
    return { ...DASHBOARD_STATS };
  }
  const res = await fetch('/api/dashboard/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getRevenueData() {
  if (USE_MOCK) {
    await delay(DELAY);
    return [...REVENUE_DATA];
  }
  const res = await fetch('/api/dashboard/revenue');
  if (!res.ok) throw new Error('Failed to fetch revenue');
  return res.json();
}

export async function getFunnelData() {
  if (USE_MOCK) {
    await delay(DELAY);
    return [...FUNNEL_DATA];
  }
  const res = await fetch('/api/dashboard/funnel');
  if (!res.ok) throw new Error('Failed to fetch funnel');
  return res.json();
}

export async function getOrigemData() {
  if (USE_MOCK) {
    await delay(DELAY);
    return [...ORIGEM_DATA];
  }
  const res = await fetch('/api/dashboard/origem');
  if (!res.ok) throw new Error('Failed to fetch origem');
  return res.json();
}

export async function getRecentAppointments() {
  if (USE_MOCK) {
    await delay(DELAY);
    return [...RECENT_APPOINTMENTS];
  }
  const res = await fetch('/api/appointments/recent');
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return res.json();
}

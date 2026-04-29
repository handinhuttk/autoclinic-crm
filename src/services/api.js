import {
  LEADS, DASHBOARD_STATS, REVENUE_DATA, FUNNEL_DATA, ORIGEM_DATA,
  RECENT_APPOINTMENTS, META_ADS_OVERVIEW, META_ADS_TIMELINE,
  META_ADS_CAMPAIGNS, META_ADS_COMPARISON,
} from '../data/mockData';

const USE_MOCK   = import.meta.env.VITE_USE_MOCK === 'true';
const DELAY      = 800;
const API_BASE   = import.meta.env.VITE_API_URL || 'http://72.62.136.15:3001/api';
const CLIENTE_ID = 1;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeads(filters = {}) {
  if (USE_MOCK) { await delay(DELAY); return [...LEADS]; }
  const params = new URLSearchParams({ cliente_id: CLIENTE_ID, limit: 100, ...filters });
  const data   = await apiFetch(`/leads?${params}`);
  return data.leads ?? data;
}

export async function getLead(id) {
  if (USE_MOCK) { await delay(300); return LEADS.find((l) => l.id === id) ?? null; }
  return apiFetch(`/leads/${id}`);
}

export async function updateLeadStage(id, stage) {
  if (USE_MOCK) { await delay(200); return { id, stage, updatedAt: new Date().toISOString() }; }
  return apiFetch(`/leads/${id}/status`, {
    method: 'PATCH',
    body:   JSON.stringify({ status: stage, kanban_column: stage }),
  });
}

export async function updateLead(id, data) {
  if (USE_MOCK) {
    await delay(300);
    return { ...LEADS.find((l) => l.id === id), ...data, updatedAt: new Date().toISOString() };
  }
  return apiFetch(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  if (USE_MOCK) { await delay(DELAY); return { ...DASHBOARD_STATS }; }
  return apiFetch(`/dashboard/stats?cliente_id=${CLIENTE_ID}`);
}

export async function getRevenueData() {
  if (USE_MOCK) { await delay(DELAY); return [...REVENUE_DATA]; }
  return apiFetch(`/dashboard/revenue?cliente_id=${CLIENTE_ID}&months=6`);
}

export async function getFunnelData() {
  if (USE_MOCK) { await delay(DELAY); return [...FUNNEL_DATA]; }
  return apiFetch(`/dashboard/funnel?cliente_id=${CLIENTE_ID}`);
}

export async function getOrigemData() {
  if (USE_MOCK) { await delay(DELAY); return [...ORIGEM_DATA]; }
  return apiFetch(`/dashboard/sources?cliente_id=${CLIENTE_ID}`);
}

export async function getRecentAppointments() {
  if (USE_MOCK) { await delay(DELAY); return [...RECENT_APPOINTMENTS]; }
  return apiFetch(`/leads?cliente_id=${CLIENTE_ID}&status=agendado&limit=5`);
}

// ─── Meta Ads ─────────────────────────────────────────────────────────────────

export async function getMetaAdsOverview(days = 30) {
  if (USE_MOCK) { await delay(DELAY); return { ...META_ADS_OVERVIEW, lastSync: new Date().toISOString() }; }
  return apiFetch(`/metaads/overview?cliente_id=${CLIENTE_ID}&days=${days}`);
}

export async function getMetaAdsCampaigns(days = 30) {
  if (USE_MOCK) { await delay(600); return [...META_ADS_CAMPAIGNS]; }
  return apiFetch(`/metaads/campaigns?cliente_id=${CLIENTE_ID}&days=${days}`);
}

export async function getMetaAdsTimeline(days = 30) {
  if (USE_MOCK) { await delay(600); return [...META_ADS_TIMELINE]; }
  return apiFetch(`/metaads/timeline?cliente_id=${CLIENTE_ID}&days=${days}`);
}

export async function getMetaAdsComparison(days = 30) {
  if (USE_MOCK) { await delay(600); return [...META_ADS_COMPARISON]; }
  return apiFetch(`/metaads/comparison?cliente_id=${CLIENTE_ID}&days=${days}`);
}

export async function connectMetaAds({ accessToken, adAccountId }) {
  if (USE_MOCK) {
    await delay(1200);
    return { connected: true, accountName: 'AutoClinic Ads Account', currency: 'BRL' };
  }
  return apiFetch('/metaads/connect', {
    method: 'POST',
    body:   JSON.stringify({ cliente_id: CLIENTE_ID, access_token: accessToken, ad_account_id: adAccountId }),
  });
}

export async function syncMetaAds() {
  if (USE_MOCK) { await delay(2000); return { success: true, upserted: 87 }; }
  return apiFetch(`/metaads/sync/${CLIENTE_ID}`, { method: 'POST' });
}

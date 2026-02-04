export type CampaignStatus = 'active' | 'paused' | 'finished';

export interface Campaign {
  _id: string;
  name: string;
  advertiser: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
}

export interface CampaignListResponse {
  data: Campaign[];
  total: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.error ?? `Erreur API (${res.status})`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchCampaigns(params?: { status?: CampaignStatus }) {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  const url = `${API_BASE_URL}/campaigns${search.toString() ? `?${search.toString()}` : ''}`;
  const res = await fetch(url);
  return handleResponse<CampaignListResponse>(res);
}

export async function createCampaign(payload: Omit<Campaign, '_id'>) {
  const res = await fetch(`${API_BASE_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Campaign>(res);
}

export async function fetchCampaign(id: string) {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
  return handleResponse<Campaign>(res);
}

export async function fetchCampaignStats(id: string) {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}/stats`);
  return handleResponse<{ ctr: number; cpc: number }>(res);
}

export async function updateCampaignStatus(id: string, status: CampaignStatus) {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Campaign>(res);
}



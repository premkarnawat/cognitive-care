import { supabase } from './supabase';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '';

if (!BACKEND_URL) {
  console.error("VITE_API_BASE_URL is missing in Vercel Environment Variables");
}

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };
}

export async function apiPost<T = any>(endpoint: string, body: any): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}${endpoint}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
